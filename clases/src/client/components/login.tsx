import { FormEvent, useState } from "react";

import {
  Alert,
  Button,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export const Login = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setErrors([]);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;

    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirectTo");
      window.location.href = redirectTo || "/";
    } else {
      const data = await response.json();
      setErrors(data.errors || []);
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            name="username"
            label="Username"
            variant="outlined"
            fullWidth
            required
            disabled={loading}
          />

          {errors.includes("username-required") && (
            <Alert severity="error">Username is required</Alert>
          )}

          {errors.includes("user-not-found") && (
            <Alert severity="error">
              Username does not exist.{" "}
              <Link href="/signup" underline="hover">
                Go to /signup
              </Link>{" "}
              to create an account.
            </Alert>
          )}

          <Button type="submit" variant="outlined" fullWidth disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Stack>
      </form>
    </Container>
  );
};
