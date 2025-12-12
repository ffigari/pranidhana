import { Container, Typography } from "@mui/material";

import { Topbar } from "../shared/topbar";

export const MyClasses = () => {
  return (
    <>
      <Topbar />
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
