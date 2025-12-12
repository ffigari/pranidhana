import { Box, Button, Stack } from "@mui/material";

import { TeachersSearcher, useStore } from "./state";

export const TeachersStepContent = () => {
  const goBack = useStore((s) => s.goBack);
  const advance = useStore((s) => s.advance);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      advance();
    }
  };

  return (
    <Stack spacing={2} onKeyDown={handleKeyDown}>
      <TeachersSearcher />

      <Box>
        <Button
          onClick={() => {
            goBack();
          }}
          sx={{ mt: 1, mr: 1 }}
        >
          Volver
        </Button>

        <Button
          onClick={() => {
            advance();
          }}
          sx={{ mt: 1, mr: 1 }}
        >
          Continuar
        </Button>
      </Box>
    </Stack>
  );
};
