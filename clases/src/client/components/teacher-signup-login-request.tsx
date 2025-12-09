import { Button, Container, Link, Stack, Typography } from "@mui/material";
import { paths } from "@shared/paths";

export const TeacherSignupLoginRequest = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Teacher Signup Login Request
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Antes de registrarte como profe tenés que hacer login
      </Typography>

      <Link href={`${paths.login}?redirectTo=${paths.teacherSignup}`}>
        Ir al login
      </Link>
    </Container>
  );
};
