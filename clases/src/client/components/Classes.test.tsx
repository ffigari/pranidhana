/**
 * @vitest-environment jsdom
 */

import { describe, it, vi, expect } from "vitest"
import '@testing-library/jest-dom'

import { render, screen, act } from "@testing-library/react"

import { PaginatedClasses, Class } from "@shared/class"

import { Classes, API } from "./Classes"

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: any) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe("classes", () => {
	it("should fetch all pages if sentinel does not leave screen", async () => {
		const { promise: p1, resolve: r1 } = deferred<PaginatedClasses>()
		const { promise: p2, resolve: r2 } = deferred<PaginatedClasses>()

		const apiMock: API = {
			getClasses: vi.fn()
			.mockReturnValueOnce(p1)
			.mockReturnValueOnce(p2)
		}

		let sentinelEnteredViewportCB: () => Promise<void>
		let sentinelLeftViewportCB: () => void

		render(<Classes api={apiMock} renderViewportSentinel={({ onEnter, onLeave }) => {
			sentinelEnteredViewportCB = onEnter
			sentinelLeftViewportCB = onLeave
			return (<></>)
		}} renderClasses={(classes) => (
			<ul>
				{classes.map(c => (
					<li key={c.id}>Clase {c.id}</li>
				))}
			</ul>
		)} />)

		sentinelEnteredViewportCB!()

		const fn = (expectedSize: number, expectedCursor: string | null) => {
			const calls = (apiMock.getClasses as any).mock.calls
			expect(calls.length).toEqual(expectedSize)
			expect(calls[expectedSize - 1][0]).toEqual(expectedCursor)
		}
		fn(1, null)

		await act(async () => r1(new PaginatedClasses([
			new Class(1),
			new Class(2),
		], "cursor-1", true)))

		expect(await screen.findByText("Clase 1")).toBeInTheDocument()
		expect(await screen.findByText("Clase 2")).toBeInTheDocument()
		expect(screen.queryByText("Clase 3")).not.toBeInTheDocument()
		expect(screen.queryByText("Clase 4")).not.toBeInTheDocument()

		fn(2, "cursor-1")

		await act(async () => r2(new PaginatedClasses([
			new Class(3),
			new Class(4),
		], "cursor-2", false)))

		expect(await screen.findByText("Clase 1")).toBeInTheDocument()
		expect(await screen.findByText("Clase 2")).toBeInTheDocument()
		expect(await screen.findByText("Clase 3")).toBeInTheDocument()
		expect(await screen.findByText("Clase 4")).toBeInTheDocument()
	})

	it("should wait for scroll if sentinel leaves screen", async () => {
		const { promise: p1, resolve: r1 } = deferred<PaginatedClasses>()
		const { promise: p2, resolve: r2 } = deferred<PaginatedClasses>()

		const apiMock: API = {
			getClasses: vi.fn()
			.mockReturnValueOnce(p1)
			.mockReturnValueOnce(p2)
		}

		let sentinelEnteredViewportCB: () => Promise<void>
		let sentinelLeftViewportCB: () => void

		render(<Classes api={apiMock} renderViewportSentinel={({ onEnter, onLeave }) => {
			sentinelEnteredViewportCB = onEnter
			sentinelLeftViewportCB = onLeave
			return (<></>)
		}} renderClasses={(classes) => (
			<ul>
				{classes.map(c => (
					<li key={c.id}>Clase {c.id}</li>
				))}
			</ul>
		)} />)

		sentinelEnteredViewportCB!()


		const fn = (expectedSize: number, expectedCursor: string | null) => {
			const calls = (apiMock.getClasses as any).mock.calls
			expect(calls.length).toEqual(expectedSize)
			expect(calls[expectedSize - 1][0]).toEqual(expectedCursor)
		}
		fn(1, null)

		sentinelLeftViewportCB!()

		await act(async () => r1(new PaginatedClasses([
			new Class(1),
			new Class(2),
		], "cursor-1", true)))

		expect(await screen.findByText("Clase 1")).toBeInTheDocument()
		expect(await screen.findByText("Clase 2")).toBeInTheDocument()
		expect(screen.queryByText("Clase 3")).not.toBeInTheDocument()
		expect(screen.queryByText("Clase 4")).not.toBeInTheDocument()


		expect(await screen.findByText("Clase 1")).toBeInTheDocument()
		expect(await screen.findByText("Clase 2")).toBeInTheDocument()
		expect(screen.queryByText("Clase 3")).not.toBeInTheDocument()
		expect(screen.queryByText("Clase 4")).not.toBeInTheDocument()

		fn(1, null)

		sentinelEnteredViewportCB!()

		fn(2, "cursor-1")

		await act(async () => r2(new PaginatedClasses([
			new Class(3),
			new Class(4),
		], "cursor-2", false)))

		expect(await screen.findByText("Clase 1")).toBeInTheDocument()
		expect(await screen.findByText("Clase 2")).toBeInTheDocument()
		expect(await screen.findByText("Clase 3")).toBeInTheDocument()
		expect(await screen.findByText("Clase 4")).toBeInTheDocument()

		sentinelLeftViewportCB!()

		fn(2, "cursor-1")

		sentinelEnteredViewportCB!()

		fn(2, "cursor-1")
	})
})
