import { ID } from "@domain";

export type EntryID = ID;

export interface Entry {
    id: EntryID;
    text: string;
    createdAt: Date;
}

export interface EntryCreationRequest {
    text: string;
}

export const assertValidEntryCreationRequest = (
    request: EntryCreationRequest
): void => {
    if (request.text.trim() === "") {
        throw new Error("missing text");
    }
};
