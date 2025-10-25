import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express, { Router } from "express";

import { Class, PaginatedClasses } from "@shared/class"
import { serveAPI, Classes } from "./api";

describe("api", () => {
	let app: express.Express;
	let classesMock: Classes;

	beforeEach(() => {
		classesMock = {
			get: vi.fn(),
		}

		app = express()

		const apiRouter = Router()
		serveAPI(apiRouter, classesMock)
		app.use("/", apiRouter)

	})

	it("should serve first page of classes and their teachers", async () => {
		const paginatedClasses = new PaginatedClasses([
			new Class(1),
			new Class(2),
		], "end-cursor-1", true);

		(classesMock.get as any).mockReturnValueOnce(paginatedClasses)

		const res = await request(app).get("/classes?limit=2&include=teachers")
		expect(res.status).toBe(200)
		expect(res.body).toEqual(paginatedClasses)
		expect(classesMock.get).toHaveBeenCalledWith({
			limit: 2,
			includeTeachers: true,
		})
	})

	it("should serve second page of classes and their teachers", async () => {
		const paginatedClasses = new PaginatedClasses([
			new Class(2),
			new Class(3),
		], "end-cursor-2", false);

		(classesMock.get as any).mockReturnValueOnce(paginatedClasses)

		const res = await request(app).get("/classes?limit=3&cursor=end-cursor-1&include=teachers")
		expect(res.status).toBe(200)
		expect(res.body).toEqual(paginatedClasses)
		expect(classesMock.get).toHaveBeenCalledWith({
			limit: 3,
			cursor: "end-cursor-1",
			includeTeachers: true,
		})
	})

	it("should serve second page of classes without teachers when include parameter is not sent", async () => {
		const paginatedClasses = new PaginatedClasses([
			new Class(2),
			new Class(3),
		], "end-cursor-2", false);

		(classesMock.get as any).mockReturnValueOnce(paginatedClasses)

		const res = await request(app).get("/classes?limit=3&cursor=end-cursor-1")
		expect(res.status).toBe(200)
		expect(res.body).toEqual(paginatedClasses)
		expect(classesMock.get).toHaveBeenCalledWith({
			limit: 3,
			cursor: "end-cursor-1",
			includeTeachers: false,
		})
	})
})
