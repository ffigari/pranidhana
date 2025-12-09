import { Container, Typography } from "@mui/material";

import { Me } from "../shared/me";

export const Dojos = () => {
  return (
    <>
      <Me />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Dojos
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          TODO: Implement list
        </Typography>
      </Container>
    </>
  );
};
