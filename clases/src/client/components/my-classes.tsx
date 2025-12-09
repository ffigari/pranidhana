import { Container, Typography } from "@mui/material";

import { Me } from "../shared/me";

export const MyClasses = () => {
  return (
    <>
      <Me />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          My Classes
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          TODO: show my classes
        </Typography>
      </Container>
    </>
  );
};
