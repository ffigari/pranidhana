import { createHTTPServer } from "@pranidhana/lib";
import { PaginatedClasses } from "@shared/class";
import { paths } from "@shared/paths";
import cors from "cors";
import express, { Express, Request, Router } from "express";
import session from "express-session";
import path from "path";

import { classes } from "./classes";
import { dojos } from "./dojos";
import { login } from "./login";
import { me } from "./me";
import { teacher } from "./teacher";

export interface Classes {
  get(filters: {
    limit: number;
    cursor?: string;
    includeTeachers?: boolean;
  }): PaginatedClasses;
}

export const serveAPI = (app: Router, classes: Classes): void => {
  app.get(
    "/classes",
    (
      req: Request<
        unknown,
        unknown,
        unknown,
        {
          limit?: string;
          cursor?: string;
          include?: string | string[];
        }
      >,
      res
    ) => {
      const { limit: unparsedLimit, cursor, include } = req.query;

      const limit = unparsedLimit ? parseInt(unparsedLimit, 10) : 10;

      // Parse the include parameter to determine if teachers should be included
      const includeArray = Array.isArray(include)
        ? include
        : include
          ? [include]
          : [];
      const includeTeachers = includeArray.includes("teachers");

      res.json(classes.get({ limit, cursor, includeTeachers }));
    }
  );
};

export const createWebServer = (classesOLD: Classes): Express => {
  const app = createHTTPServer();

  app.use(cors());

  // Request logging
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      name: "sid", // cookie name
      secret: "a-very-secret", // TODO: set this up from env
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, // TODO: set this up from env
        sameSite: "lax",
        maxAge: 1000 * 60 * 60, // 1 hour
      },
    })
  );

  const apiRouter = express.Router();
  serveAPI(apiRouter, classesOLD);
  app.use("/api", apiRouter);

  const reactAppDir = path.resolve(__dirname, "../../client");
  app.use(express.static(reactAppDir));

  const entrypointsDir = path.join(reactAppDir, "entrypoints");

  app.get("/favicon.ico", (_, res) => {
    res.sendStatus(204);
  });

  app.get(paths.home, (_, res) => {
    res.sendFile(path.join(entrypointsDir, "index.html"));
  });

  login(app, entrypointsDir);
  me(app);
  teacher(app, entrypointsDir);
  dojos(app, entrypointsDir);
  classes(app, entrypointsDir);

  return app;
};
