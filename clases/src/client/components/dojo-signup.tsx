import { Button, Container, Stack, Typography } from "@mui/material";

import { Me } from "../shared/me";

export const DojoSignup = () => {
  return (
    <>
      <Me />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Dojo Signup
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          TODO: Pedir nombre de dojo y ofrecer listado de "teachers" para armar
          el dojo
        </Typography>
      </Container>
    </>
  );
};
