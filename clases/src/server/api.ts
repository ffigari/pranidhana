import path from "path";
import express, { Express, Router, Request } from "express";
import cors from "cors";

import { PaginatedClasses } from "@shared/class"
import { createHTTPServer } from "@pranidhana/lib";

export interface Classes {
	get(filters: { limit: number, cursor?: string, includeTeachers?: boolean }): PaginatedClasses
}

export const serveAPI = (app: Router, classes: Classes): void => {
	app.get("/classes", (req: Request<unknown, unknown, unknown, {
		limit?: string,
		cursor?: string,
		include?: string | string[],
	}>, res) => {
		const { limit: unparsedLimit, cursor, include } = req.query;

		const limit = unparsedLimit ? parseInt(unparsedLimit, 10) : 10;

		// Parse the include parameter to determine if teachers should be included
		const includeArray = Array.isArray(include) ? include : (include ? [include] : []);
		const includeTeachers = includeArray.includes("teachers");

		res.json(classes.get({ limit, cursor, includeTeachers }))
	})
}

export const createWebPersonalServer = (classes: Classes): Express => {
  const app = createHTTPServer();

  app.use(cors())

  const apiRouter = express.Router()
  serveAPI(apiRouter, classes)
  app.use("/api", apiRouter)

  const reactAppDir = path.resolve(__dirname, "../../client");
  app.use(express.static(reactAppDir));
  app.get(/.*/, (_, res) => {
    res.sendFile(path.join(reactAppDir, "index.html"));
  });

  return app;
};

