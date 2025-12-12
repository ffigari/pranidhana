import { Box, Link, Typography } from "@mui/material";
import { errorCodes } from "@shared/me";
import { User } from "@shared/user";
import { useQuery } from "@tanstack/react-query";

export type FetchedUser =
  | { status: "authenticated"; user: User }
  | { status: "unauthenticated" }
  | { status: "loading" }
  | { status: "error" };

const fetchMe = async (): Promise<FetchedUser> => {
  try {
    const response = await fetch("/me");

    if (response.ok) {
      const data = await response.json();
      return { status: "authenticated", user: data };
    }

    const data = await response.json();
    if (data.errors && data.errors.includes(errorCodes.notLoggedIn)) {
      return { status: "unauthenticated" };
    }

    return { status: "error" };
  } catch {
    return { status: "error" };
  }
};

export const useMe = (): FetchedUser => {
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });

  if (isLoading) {
    return { status: "loading" };
  }

  return data || { status: "error" };
};

export const Me = () => {
  const fetchedUser = useMe();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        padding: 2,
        backgroundColor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        boxShadow: 2,
      }}
    >
      {fetchedUser.status === "loading" && <Typography>Cargando...</Typography>}

      {fetchedUser.status === "error" && (
        <Typography color="error">
          Error al cargar información del usuario
        </Typography>
      )}

      {fetchedUser.status === "authenticated" && (
        <Typography>Logged in as: {fetchedUser.user.username}</Typography>
      )}

      {fetchedUser.status === "unauthenticated" && (
        <Typography>
          Not logged in.{" "}
          <Link
            href={`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`}
            underline="hover"
          >
            Go to /login
          </Link>
        </Typography>
      )}
    </Box>
  );
};
