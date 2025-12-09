import { Button, Container, Link, Stack, Typography } from "@mui/material";
import { paths } from "@shared/paths";

export const DojoSignupLoginRequest = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Dojo Signup Login Request
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Antes de crear un dojo tenés que hacer login
      </Typography>

      <Link href={`${paths.login}?redirectTo=${paths.dojoSignup}`}>
        Ir al login
      </Link>
    </Container>
  );
};
