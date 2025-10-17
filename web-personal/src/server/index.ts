import path from "path";
import express, { Express } from "express";

import { Teacher } from "@shared/teacher";
import { createHTTPServer } from "@pranidhana/lib";

const name = "web-personal"

export const createWebPersonalServer = (): Express => {
	const app = createHTTPServer()

	const pagesDir = path.resolve(__dirname, "../pages");
	app.use(express.static(pagesDir));

	app.get("/", (_, res) => res.redirect("/i"));

	app.get("/i", (_, res) => {
		res.sendFile(path.resolve(__dirname, "../pages/i.html"))
	})

	app.get("/favicon.ico", (_, res) => {
		res.sendStatus(204)
	})

  // ✅ Serve the React app at /shared-code-experiment
  const reactAppDir = path.resolve(__dirname, "../../client");

  // Serve static assets (JS/CSS) under this prefix
  app.use("/shared-code-experiment", express.static(reactAppDir));

  // Serve the React entry point (index.html) for the exact route
  app.get("/shared-code-experiment", (_, res) => {
    res.sendFile(path.join(reactAppDir, "index.html"));
  });

	return app
}

const port = 3000

createWebPersonalServer().listen(port, () => {
	console.log(`starting "${name}" at port ${port}`)
	const t = new Teacher("pepe")
	console.log(t.sayHello())
})
