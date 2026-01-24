import { describe, it, expect, vi } from "vitest";
import { Entries } from "./entries";
import { EntryCreationRequest, EntryID } from "@domain/entry";

describe("Entries", () => {
    describe("create", () => {
        it("should create entry with valid request", async () => {
            const mockCreate = vi.fn().mockResolvedValue("test-id" as EntryID);
            const mockPersistentMemory = {
                getEntryByID: vi.fn(),
                create: mockCreate,
            };

            const entries = new Entries(mockPersistentMemory);
            const request: EntryCreationRequest = { text: "Hello world" };

            const id = await entries.create(request);

            expect(id).toBe("test-id");
            expect(mockCreate).toHaveBeenCalledWith(request);
            expect(mockCreate).toHaveBeenCalledTimes(1);
        });

        it("should throw error with invalid request (empty text)", async () => {
            const mockPersistentMemory = {
                getEntryByID: vi.fn(),
                create: vi.fn(),
            };

            const entries = new Entries(mockPersistentMemory);
            const request: EntryCreationRequest = { text: "" };

            await expect(entries.create(request)).rejects.toThrow(
                "missing text"
            );
            expect(mockPersistentMemory.create).not.toHaveBeenCalled();
        });

        it("should throw error with invalid request (whitespace only)", async () => {
            const mockPersistentMemory = {
                getEntryByID: vi.fn(),
                create: vi.fn(),
            };

            const entries = new Entries(mockPersistentMemory);
            const request: EntryCreationRequest = { text: "   " };

            await expect(entries.create(request)).rejects.toThrow(
                "missing text"
            );
            expect(mockPersistentMemory.create).not.toHaveBeenCalled();
        });
    });

    describe("getByID", () => {
        it("should call persistentMemory.getEntryByID with correct id", async () => {
            const mockEntry = {
                id: "test-id" as EntryID,
                text: "Hello world",
                createdAt: new Date(),
            };
            const mockGetEntryByID = vi.fn().mockResolvedValue(mockEntry);
            const mockPersistentMemory = {
                getEntryByID: mockGetEntryByID,
                create: vi.fn(),
            };

            const entries = new Entries(mockPersistentMemory);
            const result = await entries.getByID("test-id" as EntryID);

            expect(result).toBe(mockEntry);
            expect(mockGetEntryByID).toHaveBeenCalledWith("test-id");
            expect(mockGetEntryByID).toHaveBeenCalledTimes(1);
        });

        it("should return null when entry not found", async () => {
            const mockGetEntryByID = vi.fn().mockResolvedValue(null);
            const mockPersistentMemory = {
                getEntryByID: mockGetEntryByID,
                create: vi.fn(),
            };

            const entries = new Entries(mockPersistentMemory);
            const result = await entries.getByID("non-existent-id" as EntryID);

            expect(result).toBeNull();
            expect(mockGetEntryByID).toHaveBeenCalledWith("non-existent-id");
        });
    });
});
