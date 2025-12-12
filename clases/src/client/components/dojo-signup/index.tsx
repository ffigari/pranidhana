import { useState } from "react";

import {
  Alert,
  Box,
  Container,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { errorCodes } from "@shared/dojo";

import { Topbar } from "../../shared/topbar";
import { AdminsStepContent } from "./adminsStep";
import { BaseInfoStepContent } from "./baseInfo";
import { useAdminsCollection, useStore, useTeachersCollection } from "./state";
import { TeachersStepContent } from "./teachersStep";

const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case errorCodes.nameRequired:
      return "El nombre del dojo es requerido";
    case errorCodes.nameTaken:
      return "Este nombre ya está en uso";
    case errorCodes.invalidNameFormat:
      return "El nombre del dojo solo puede contener letras, números y espacios";
    case errorCodes.invalidTeacherId:
      return "Uno o más profesores seleccionados no son válidos";
    case errorCodes.noAdmins:
      return "Debes seleccionar al menos un administrador";
    case errorCodes.invalidAdminId:
      return "Uno o más administradores seleccionados no son válidos";
    default:
      return "Error al crear el dojo";
  }
};

export const DojoSignup = () => {
  const activeStep = useStore((s) => s.activeStep);
  const dojoName = useStore((s) => s.dojoName);
  const teachers = useTeachersCollection((s) => s.collection);
  const admins = useAdminsCollection((s) => s.collection);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const teacherIds = teachers.map((teacher) => teacher.id);
    const adminIds = admins.map((admin) => admin.id);

    try {
      const response = await fetch("/api/dojos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: dojoName,
          teacherIds,
          adminIds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.errors && errorData.errors.length > 0) {
          const errorCode = errorData.errors[0];
          setSubmitError(getErrorMessage(errorCode));
        } else {
          setSubmitError("Error al crear el dojo");
        }
        return;
      }

      const data = await response.json();
      window.location.href = `/dojos/${data.id}`;
    } catch (error) {
      console.error("Error creating dojo:", error);
      setSubmitError("Error al crear el dojo");
    }
  };

  return (
    <>
      <Topbar />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Dojo Signup
        </Typography>

        <Box maxWidth="md">
          <form onSubmit={handleSubmit}>
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step>
                <StepLabel>Qué estamos creando?</StepLabel>
                <StepContent>
                  <BaseInfoStepContent />
                </StepContent>
              </Step>

              <Step>
                <StepLabel>Quiénes van a enseñar?</StepLabel>
                <StepContent>
                  <TeachersStepContent />
                </StepContent>
              </Step>

              <Step>
                <StepLabel>Quiénes van a administrar?</StepLabel>
                <StepContent>
                  <AdminsStepContent />
                </StepContent>
              </Step>
            </Stepper>

            {submitError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {submitError}
              </Alert>
            )}
          </form>
        </Box>
      </Container>
    </>
  );
};
