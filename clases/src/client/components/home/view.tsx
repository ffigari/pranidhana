import { Button, Container, Stack, Typography } from "@mui/material";
import { userHasTeacherInfo, userIsTeacher } from "@shared/user";

import { FetchedUser } from "../../shared/me";
import { Topbar } from "../../shared/topbar";

interface HomeViewProps {
  fetchedUser: FetchedUser;
}

export const HomeView = ({ fetchedUser }: HomeViewProps) => {
  return (
    <>
      <Topbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Dojo!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Dónde se encuentran estudiantes y profesores.
        </Typography>
        <Stack spacing={2}>
          <Button href="/classes" variant="outlined">
            Mirá todas las clases disponibles
          </Button>
          <Button href="/dojos" variant="outlined">
            Ver todos los dojos
          </Button>
          <Button href="/dojo-signup" variant="outlined">
            Abrí un dojo
          </Button>
          {fetchedUser.status === "authenticated" &&
          userHasTeacherInfo(fetchedUser.user) &&
          userIsTeacher(fetchedUser.user) ? (
            <Button href="/my-classes" variant="outlined">
              Ver mis clases
            </Button>
          ) : (
            <Button href="/teacher-signup" variant="outlined">
              Registrate como profe
            </Button>
          )}
        </Stack>
      </Container>
    </>
  );
};
