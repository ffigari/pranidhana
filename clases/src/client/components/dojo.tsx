import { useEffect, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DojoWithUsers } from "@shared/dojo";
import { User } from "@shared/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useMe } from "../shared/me";
import { Topbar } from "../shared/topbar";
import { createUsersSearcher } from "../shared/users";

type FetchedDojo =
  | { status: "ok"; dojo: DojoWithUsers }
  | { status: "loading" }
  | { status: "error" };

const fetchDojo = async (dojoId: string): Promise<DojoWithUsers> => {
  const response = await fetch(`/api/dojos/${dojoId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch dojo");
  }
  return response.json();
};

const useDojo = (dojoId: string): FetchedDojo => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dojo", dojoId],
    queryFn: () => fetchDojo(dojoId),
  });

  if (isLoading) {
    return { status: "loading" };
  }

  if (isError || !data) {
    return { status: "error" };
  }

  return { status: "ok", dojo: data };
};

const updateDojoName = async (dojoId: string, name: string): Promise<void> => {
  const response = await fetch(`/api/dojos/${dojoId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0] || "Failed to update dojo");
  }
};

const updateDojoTeachers = async (
  dojoId: string,
  teacherIds: string[]
): Promise<void> => {
  const response = await fetch(`/api/dojos/${dojoId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ teacherIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0] || "Failed to update teachers");
  }
};

const updateDojoAdmins = async (
  dojoId: string,
  adminIds: string[]
): Promise<void> => {
  const response = await fetch(`/api/dojos/${dojoId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminIds }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0] || "Failed to update admins");
  }
};

const EditNameModal = ({
  open,
  onClose,
  dojoId,
  currentName,
}: {
  open: boolean;
  onClose: () => void;
  dojoId: string;
  currentName: string;
}) => {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setName(currentName);
      setError(null);
    }
  }, [open, currentName]);

  const mutation = useMutation({
    mutationFn: () => updateDojoName(dojoId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dojo", dojoId] });
      onClose();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar nombre del dojo</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Descartar cambios</Button>
        <Button
          onClick={() => mutation.mutate()}
          variant="contained"
          disabled={mutation.isPending}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const {
  useUsersCollection: useTeachersCollection,
  UsersSearcher: TeachersSearcher,
} = createUsersSearcher({
  onlyTeachers: true,
  label: "Buscar profesores",
});

const EditTeachersModal = ({
  open,
  onClose,
  dojoId,
  currentTeachers,
}: {
  open: boolean;
  onClose: () => void;
  dojoId: string;
  currentTeachers: User[];
}) => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const teachers = useTeachersCollection((s) => s.collection);
  const setTeachers = useTeachersCollection((s) => s.setAll);

  useEffect(() => {
    if (open) {
      setTeachers(currentTeachers);
      setError(null);
    }
  }, [open, currentTeachers, setTeachers]);

  const mutation = useMutation({
    mutationFn: () =>
      updateDojoTeachers(
        dojoId,
        teachers.map((t) => t.id)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dojo", dojoId] });
      onClose();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar profesores</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TeachersSearcher />
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Descartar cambios</Button>
        <Button
          onClick={() => mutation.mutate()}
          variant="contained"
          disabled={mutation.isPending}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const {
  useUsersCollection: useAdminsCollection,
  UsersSearcher: AdminsSearcher,
} = createUsersSearcher({
  onlyTeachers: false,
  label: "Buscar administradores",
});

const EditAdminsModal = ({
  open,
  onClose,
  dojoId,
  currentAdmins,
}: {
  open: boolean;
  onClose: () => void;
  dojoId: string;
  currentAdmins: User[];
}) => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const admins = useAdminsCollection((s) => s.collection);
  const setAdmins = useAdminsCollection((s) => s.setAll);
  const fetchedMe = useMe();

  useEffect(() => {
    if (open) {
      setAdmins(currentAdmins);
      setError(null);
    }
  }, [open, currentAdmins, setAdmins]);

  const mutation = useMutation({
    mutationFn: () =>
      updateDojoAdmins(
        dojoId,
        admins.map((a) => a.id)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dojo", dojoId] });
      onClose();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const currentUserInAdmins =
    fetchedMe.status === "authenticated" &&
    admins.some((admin) => admin.id === fetchedMe.user.id);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar administradores</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <AdminsSearcher />
          {!currentUserInAdmins && (
            <Alert severity="warning">
              No puedes removerte a ti mismo de la lista de administradores
            </Alert>
          )}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Descartar cambios</Button>
        <Button
          onClick={() => mutation.mutate()}
          variant="contained"
          disabled={mutation.isPending || !currentUserInAdmins}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const Dojo = () => {
  const dojoId = window.location.pathname.split("/").pop()!;
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [editTeachersOpen, setEditTeachersOpen] = useState(false);
  const [editAdminsOpen, setEditAdminsOpen] = useState(false);

  const fetchedDojo = useDojo(dojoId);
  const fetchedMe = useMe();

  if (fetchedDojo.status === "loading") {
    return <Typography>Cargando...</Typography>;
  }

  if (fetchedDojo.status === "error") {
    return <Alert severity="error">Error al cargar el dojo</Alert>;
  }

  const { dojo } = fetchedDojo;

  const isAdmin =
    fetchedMe.status === "authenticated" &&
    dojo.admins.some((admin) => admin.id === fetchedMe.user.id);

  return (
    <>
      <Topbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={4}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
                {dojo.name}
              </Typography>
              {isAdmin && (
                <IconButton size="small" onClick={() => setEditNameOpen(true)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Typography variant="h5">Profesores</Typography>
              {isAdmin && (
                <IconButton
                  size="small"
                  onClick={() => setEditTeachersOpen(true)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            {dojo.teachers.length === 0 ? (
              <Typography color="text.secondary">
                No hay profesores asignados
              </Typography>
            ) : (
              <Stack spacing={1}>
                {dojo.teachers.map((teacher) => (
                  <Box
                    key={teacher.id}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    <Typography>{teacher.username}</Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Typography variant="h5">Administradores</Typography>
              {isAdmin && (
                <IconButton
                  size="small"
                  onClick={() => setEditAdminsOpen(true)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            {dojo.admins.length === 0 ? (
              <Typography color="text.secondary">
                No hay administradores asignados
              </Typography>
            ) : (
              <Stack spacing={1}>
                {dojo.admins.map((admin) => (
                  <Box
                    key={admin.id}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    <Typography>{admin.username}</Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>

        {isAdmin && (
          <>
            <EditNameModal
              open={editNameOpen}
              onClose={() => setEditNameOpen(false)}
              dojoId={dojoId}
              currentName={dojo.name}
            />
            <EditTeachersModal
              open={editTeachersOpen}
              onClose={() => setEditTeachersOpen(false)}
              dojoId={dojoId}
              currentTeachers={dojo.teachers}
            />
            <EditAdminsModal
              open={editAdminsOpen}
              onClose={() => setEditAdminsOpen(false)}
              dojoId={dojoId}
              currentAdmins={dojo.admins}
            />
          </>
        )}
      </Container>
    </>
  );
};
