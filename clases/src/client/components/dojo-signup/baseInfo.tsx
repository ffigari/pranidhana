import { Button, Stack, TextField } from "@mui/material";
import { isValidDojoName } from "@shared/dojo";

import { useStore } from "./state";

const useIsBasicInfoReady = () => {
  const dojoName = useStore((s) => s.dojoName);

  return dojoName.trim() !== "" && isValidDojoName(dojoName.trim());
};

export const BaseInfoStepContent = () => {
  const dojoName = useStore((s) => s.dojoName);
  const setDojoName = useStore((s) => s.setDojoName);
  const advance = useStore((s) => s.advance);
  const isBasicInfoReady = useIsBasicInfoReady();

  const hasInvalidFormat =
    dojoName.trim() !== "" && !isValidDojoName(dojoName.trim());

  return (
    <Stack>
      <TextField
        name="dojo-name"
        label="Nombre del dojo"
        required
        value={dojoName}
        onChange={(e) => setDojoName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && isBasicInfoReady) {
            e.preventDefault();
            advance();
          }
        }}
        error={hasInvalidFormat}
        helperText={
          hasInvalidFormat ? "Solo se permiten letras, números y espacios" : ""
        }
      />
      <Button
        onClick={() => {
          advance();
        }}
        disabled={!isBasicInfoReady}
        sx={{ mt: 1, mr: 1 }}
      >
        Continuar
      </Button>
    </Stack>
  );
};
