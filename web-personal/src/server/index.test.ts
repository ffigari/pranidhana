import { describe, it, expect } from "vitest";
import request from "supertest";
import { createWebPersonalServer } from "./index";

describe("web personal server", () => {
	const app = createWebPersonalServer()

	it("should serve home at /i", async () => {
		const res = await request(app).get("/i")
		expect(res.status).toBe(200)
		expect(res.text).toContain("jacarandá del jardín")
	})

	it("should redirect / to /i", async () => {
		const res = await request(app).get("/");
		expect(res.status).toBe(302);
		expect(res.headers.location).toBe("/i");
	});

	it("should serve home photo", async () => {
		expect((await request(app).get("/panoramica-de-casa.jpg")).status).toBe(200)
	})

	it("should serve cv and resume", async () => {
		expect((await request(app).get("/resume.pdf")).status).toBe(200)
		expect((await request(app).get("/cv.pdf")).status).toBe(200)
	})

	it("should not serve favicon", async () => {
		expect((await request(app).get("/favicon.ico")).status).toBe(204)
	})
})
