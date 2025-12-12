import { AppBar, Box, Link, Toolbar, Typography } from "@mui/material";

import { useMe } from "./me";

export const Topbar = () => {
  const fetchedUser = useMe();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Link href="/" underline="none" color="inherit">
          <Typography variant="h6">Home</Typography>
        </Link>

        <Box>
          {fetchedUser.status === "loading" && (
            <Typography>Cargando...</Typography>
          )}

          {fetchedUser.status === "error" && (
            <Typography color="error">
              Error al cargar información del usuario
            </Typography>
          )}

          {fetchedUser.status === "authenticated" && (
            <Typography>Logged in as: {fetchedUser.user.username}</Typography>
          )}

          {fetchedUser.status === "unauthenticated" && (
            <Typography>
              Not logged in.{" "}
              <Link
                href={`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`}
                underline="hover"
              >
                Go to /login
              </Link>
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
