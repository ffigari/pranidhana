import { useEffect, useRef } from "react";

import { Alert, Box, Button, Stack } from "@mui/material";

import { useMe } from "../../shared/me";
import { AdminsSearcher, useAdminsCollection, useStore } from "./state";

export const AdminsStepContent = () => {
  const goBack = useStore((s) => s.goBack);
  const admins = useAdminsCollection((s) => s.collection);
  const addAdmin = useAdminsCollection((s) => s.add);
  const hasAdmins = admins.length > 0;

  const fetchedUser = useMe();
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (fetchedUser.status !== "authenticated") {
      return;
    }

    if (!addAdmin) {
      return;
    }

    addAdmin(fetchedUser.user);
  }, [fetchedUser, addAdmin]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && hasAdmins) {
      e.preventDefault();
      submitButtonRef.current?.click();
    }
  };

  return (
    <Stack spacing={2} onKeyDown={handleKeyDown}>
      <AdminsSearcher />

      {!hasAdmins && (
        <Alert severity="info">
          Debes seleccionar al menos un administrador
        </Alert>
      )}

      <Box>
        <Button
          onClick={() => {
            goBack();
          }}
          sx={{ mt: 1, mr: 1 }}
        >
          Volver
        </Button>

        <Button
          ref={submitButtonRef}
          type="submit"
          disabled={!hasAdmins}
          sx={{ mt: 1, mr: 1 }}
        >
          Crear
        </Button>
      </Box>
    </Stack>
  );
};
