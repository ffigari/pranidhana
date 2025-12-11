import { Button, Container, Stack, Typography } from "@mui/material";

export const Classes = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Todas las clases
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        TODO: Mostrar todas las clases disponibles
      </Typography>
    </Container>
  );
};
