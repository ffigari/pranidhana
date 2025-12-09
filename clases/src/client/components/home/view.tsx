import { Button, Container, Stack, Typography } from "@mui/material";
import { paths } from "@shared/paths";

import { FetchedUser, Me } from "../../shared/me";

interface HomeViewProps {
  fetchedUser: FetchedUser;
}

export const HomeView = ({ fetchedUser }: HomeViewProps) => {
  return (
    <>
      <Me />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Dojo!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Dónde se encuentran estudiantes y profesores.
        </Typography>
        <Stack spacing={2}>
          <Button href={paths.classes} variant="outlined">
            Mirá todas las clases disponibles
          </Button>
          <Button href={paths.dojoSignup} variant="outlined">
            Abrí un dojo
          </Button>
          {fetchedUser.status === "authenticated" &&
          fetchedUser.user.isTeacher ? (
            <Button href={paths.myClasses} variant="outlined">
              Ver mis clases
            </Button>
          ) : (
            <Button href={paths.teacherSignup} variant="outlined">
              Registrate como profe
            </Button>
          )}
        </Stack>
      </Container>
    </>
  );
};
