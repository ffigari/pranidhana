import { describe, it, expect } from "vitest";
import { assertValidEntryCreationRequest, EntryCreationRequest } from "./entry";

describe("assertValidEntryCreationRequest", () => {
    it("should throw error if text is pure spaces", () => {
        const request: EntryCreationRequest = { text: "   " };
        expect(() => assertValidEntryCreationRequest(request)).toThrow(
            "missing text"
        );
    });

    it("should throw error if text is empty", () => {
        const request: EntryCreationRequest = { text: "" };
        expect(() => assertValidEntryCreationRequest(request)).toThrow(
            "missing text"
        );
    });

    it("should not throw error with valid text", () => {
        const request: EntryCreationRequest = { text: "Hello world" };
        expect(() => assertValidEntryCreationRequest(request)).not.toThrow();
    });

    it("should not throw error with text containing spaces but also content", () => {
        const request: EntryCreationRequest = { text: "  Hello world  " };
        expect(() => assertValidEntryCreationRequest(request)).not.toThrow();
    });
});
