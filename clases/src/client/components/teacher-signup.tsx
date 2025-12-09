import { FormEvent, useEffect, useState } from "react";

import { Button, Container, Stack, Typography } from "@mui/material";
import { paths } from "@shared/paths";

import { Me, useMe } from "../shared/me";

const AlreadyTeacher = () => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = paths.home;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Me />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Teacher Signup
        </Typography>
        <Stack spacing={2}>
          <Typography>Ya estás registrado como profesor</Typography>
          <Typography>Redirigiendo en {countdown} segs</Typography>
        </Stack>
      </Container>
    </>
  );
};

const TeacherSignupForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const response = await fetch(paths.apiTeachers, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      window.location.href = paths.dojos;
    }

    setLoading(false);
  };

  return (
    <>
      <Me />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Teacher Signup
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrarse como profe"}
            </Button>
          </Stack>
        </form>
      </Container>
    </>
  );
};

export const TeacherSignup = () => {
  const fetchedUser = useMe();

  if (fetchedUser.status === "authenticated" && fetchedUser.user.isTeacher) {
    return <AlreadyTeacher />;
  }

  return <TeacherSignupForm />;
};
