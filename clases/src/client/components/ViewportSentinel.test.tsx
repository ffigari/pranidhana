/**
 * @vitest-environment jsdom
 */

import { describe, it, vi, expect } from "vitest"
import '@testing-library/jest-dom'

import { render, screen, act } from "@testing-library/react"
import { ViewportSentinel } from "./ViewportSentinel"

let lastObserverInstance: IntersectionObserverMock | null = null

class IntersectionObserverMock {
  callback: IntersectionObserverCallback
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    lastObserverInstance = this  // store instance
  }
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  trigger(entries: Partial<IntersectionObserverEntry>[]) {
    this.callback(entries as IntersectionObserverEntry[], this as any)
  }
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock)

describe("viewport sentinel", () => {
	it("should trigger onEnter callback", async () => {
		let x = false
		render(<ViewportSentinel onEnter={() => {
			x = true
		}} onLeave={() => {}} />)

		await act(async () => lastObserverInstance?.trigger([{ isIntersecting: true }]))

		expect(x).toBe(true)
	})

	it("should trigger onLeave callback", async () => {
		let x = false
		render(<ViewportSentinel onEnter={() => {}} onLeave={() => {
			x = true
		}} />)

		await act(async () => lastObserverInstance?.trigger([{ isIntersecting: false }]))

		expect(x).toBe(true)
	})
})
