import { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { User } from "@shared/user";
import { useQuery } from "@tanstack/react-query";

import { createCollection } from "./collection";
import { useMe } from "./me";

export type FetchedMatchingUsers =
  | { status: "success"; users: User[] }
  | { status: "loading" }
  | { status: "error" };

const fetchMatchingUsers = async (
  filter: string,
  onlyTeachers: boolean
): Promise<{ users: User[] }> => {
  const params = new URLSearchParams({
    usernameContains: filter,
    pageSize: "10",
  });

  if (onlyTeachers) {
    params.append("onlyTeachers", "true");
  }

  const response = await fetch(`/users?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

export const useMatchingUsers = (
  filter: string,
  onlyTeachers: boolean
): FetchedMatchingUsers => {
  const trimmedFilter = filter.trim();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", "matching", trimmedFilter, onlyTeachers],
    queryFn: () => fetchMatchingUsers(trimmedFilter, onlyTeachers),
    enabled: trimmedFilter !== "",
  });

  if (trimmedFilter === "") {
    return { status: "success", users: [] };
  }

  if (isLoading) {
    return { status: "loading" };
  }

  if (isError) {
    return { status: "error" };
  }

  return { status: "success", users: data!.users || [] };
};

export const createUsersSearcher = ({
  onlyTeachers,
  label,
}: {
  onlyTeachers: boolean;
  label: string;
}) => {
  const useUsersCollection = createCollection<User>();

  const UsersSearcher = () => {
    const [filter, setFilter] = useState("");
    const fetchedUsers = useMatchingUsers(filter, onlyTeachers);
    const selectedUsers = useUsersCollection((s) => s.collection);
    const addUser = useUsersCollection((s) => s.add);
    const removeUser = useUsersCollection((s) => s.remove);

    const fetchedMe = useMe();

    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {selectedUsers.map(({ id, username }) => (
            <Box
              key={id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 1,
                py: 0.5,
                bgcolor:
                  fetchedMe.status === "authenticated" &&
                  fetchedMe.user.id === id
                    ? "secondary.light"
                    : "primary.light",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">{username}</Typography>
              <IconButton
                size="small"
                onClick={() => {
                  removeUser(id);
                }}
                sx={{
                  p: 0,
                  width: 20,
                  height: 20,
                }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          ))}
        </Box>

        <TextField
          label={label}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
        />

        {fetchedUsers.status === "error" && (
          <Alert severity="error">Error al buscar usuarios</Alert>
        )}

        {fetchedUsers.status === "success" &&
          !filter.trim() &&
          fetchedUsers.users.length === 0 && (
            <Alert severity="info">Empezá a escribir algún username</Alert>
          )}

        {fetchedUsers.status === "success" &&
          filter.trim() &&
          fetchedUsers.users.length === 0 && (
            <Alert severity="info">No se encontraron usuarios</Alert>
          )}

        {fetchedUsers.status === "success" &&
          filter.trim() &&
          fetchedUsers.users.length > 0 && (
            <Stack spacing={0.5}>
              {fetchedUsers.users
                .filter(
                  ({ id }) => !selectedUsers.map(({ id }) => id).includes(id)
                )
                .map((user) => (
                  <Box
                    key={user.username}
                    onClick={() => {
                      addUser(user);
                    }}
                    sx={{
                      p: 1,
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "primary.light",
                        opacity: 0.8,
                      },
                    }}
                  >
                    <Typography variant="body2">{user.username}</Typography>
                  </Box>
                ))}
            </Stack>
          )}
      </>
    );
  };

  return { useUsersCollection, UsersSearcher };
};
