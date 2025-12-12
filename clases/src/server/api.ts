import { createHTTPServer } from "@pranidhana/lib";
import cors from "cors";
import express, { Express } from "express";
import session from "express-session";
import path from "path";

import { classes } from "./classes";
import { dojos } from "./dojos";
import { login } from "./login";
import { me } from "./me";
import { teacher } from "./teacher";
import { users } from "./users";

export const createWebServer = (): Express => {
  const app = createHTTPServer();

  app.use(cors());

  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      name: "sid",
      secret: "a-very-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60,
      },
    })
  );

  const reactAppDir = path.resolve(__dirname, "../../client");
  app.use(express.static(reactAppDir));

  const entrypointsDir = path.join(reactAppDir, "entrypoints");

  app.get("/favicon.ico", (_, res) => {
    res.sendStatus(204);
  });

  app.get("/", (_, res) => {
    res.sendFile(path.join(entrypointsDir, "index.html"));
  });

  login(app, entrypointsDir);
  me(app);
  teacher(app, entrypointsDir);
  dojos(app, entrypointsDir);
  classes(app, entrypointsDir);
  users(app);

  return app;
};
