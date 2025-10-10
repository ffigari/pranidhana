import path from "path";
import express, { Express } from "express";

import { createHTTPServer } from "@pranidhana/lib";

const name = "web-personal"

export const createWebPersonalServer = (): Express => {
	const app = createHTTPServer()

	const pagesDir = path.resolve(__dirname, "../pages");
	app.use(express.static(pagesDir));

	app.get("/", (_, res) => res.redirect("/i"));

	app.get("/i", (_, res) => {
		res.sendFile(path.resolve("./pages/i.html"))
	})

	app.get("/favicon.ico", (_, res) => {
		res.sendStatus(204)
	})

	return app
}

const port = 3000

createWebPersonalServer().listen(port, () => {
	console.log(`starting "${name}" at port ${port}`)
})
