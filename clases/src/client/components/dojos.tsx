import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { PaginatedDojosDTO } from "@shared/dojo";
import { useQuery } from "@tanstack/react-query";

import { Topbar } from "../shared/topbar";

const fetchDojos = async (
  beforeCursor?: string | null,
  afterCursor?: string | null
): Promise<PaginatedDojosDTO> => {
  const params = new URLSearchParams();

  if (afterCursor) {
    params.append("afterCursor", afterCursor);
  } else if (beforeCursor) {
    params.append("beforeCursor", beforeCursor);
  }

  const response = await fetch(`/api/dojos?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch dojos");
  }
  return response.json();
};

const formatTeachers = (teachers: { username: string }[]): string => {
  if (teachers.length === 0) {
    return "Sin profesores";
  }

  if (teachers.length === 1) {
    return `Enseña ${teachers[0].username}`;
  }

  if (teachers.length === 2) {
    return `Enseñan ${teachers[0].username} y ${teachers[1].username}`;
  }

  const allButLast = teachers
    .slice(0, -1)
    .map((t) => t.username)
    .join(", ");
  const last = teachers[teachers.length - 1].username;
  return `Enseñan ${allButLast} y ${last}`;
};

export const Dojos = () => {
  const [beforeCursor, setBeforeCursor] = useState<string | null>(null);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dojos", beforeCursor, afterCursor],
    queryFn: () => fetchDojos(beforeCursor, afterCursor),
  });

  const handleNext = () => {
    if (data?.afterCursor) {
      setBeforeCursor(null);
      setAfterCursor(data.afterCursor);
    }
  };

  const handlePrevious = () => {
    if (data?.beforeCursor) {
      setAfterCursor(null);
      setBeforeCursor(data.beforeCursor);
    }
  };

  return (
    <>
      <Topbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Dojos
        </Typography>

        {isLoading && <Typography>Cargando...</Typography>}

        {isError && <Alert severity="error">Error al cargar los dojos</Alert>}

        {data && (
          <>
            <Stack spacing={2} sx={{ my: 3 }}>
              {data.page.length === 0 ? (
                <Typography color="text.secondary">
                  No hay dojos disponibles
                </Typography>
              ) : (
                data.page.map((dojo) => (
                  <Card key={dojo.id}>
                    <CardContent>
                      <Link
                        href={`/dojos/${dojo.id}`}
                        underline="hover"
                        variant="h6"
                        sx={{ display: "block", mb: 1 }}
                      >
                        {dojo.name}
                      </Link>
                      <Typography variant="body2" color="text.secondary">
                        {formatTeachers(dojo.teachers)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                onClick={handlePrevious}
                disabled={!data.beforeCursor}
                variant="outlined"
              >
                Anterior
              </Button>
              <Button
                onClick={handleNext}
                disabled={!data.afterCursor}
                variant="outlined"
              >
                Siguiente
              </Button>
            </Box>
          </>
        )}
      </Container>
    </>
  );
};
