import { FormEvent, useEffect, useState } from "react";

import { Button, Container, Stack, Typography } from "@mui/material";
import { userHasTeacherInfo, userIsTeacher } from "@shared/user";

import { useMe } from "../shared/me";
import { Topbar } from "../shared/topbar";

const AlreadyTeacher = () => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Topbar />
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

    const response = await fetch("/api/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      window.location.href = "/dojos";
    }

    setLoading(false);
  };

  return (
    <>
      <Topbar />
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

  if (
    fetchedUser.status === "authenticated" &&
    userHasTeacherInfo(fetchedUser.user) &&
    userIsTeacher(fetchedUser.user)
  ) {
    return <AlreadyTeacher />;
  }

  return <TeacherSignupForm />;
};
