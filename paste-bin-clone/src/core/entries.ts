import {
    Entry,
    EntryCreationRequest,
    EntryID,
    assertValidEntryCreationRequest,
} from "@domain/entry";

interface PersistentMemory {
    getEntryByID(id: EntryID): Promise<Entry | null>;
    create(request: EntryCreationRequest): Promise<EntryID>;
}

export class Entries {
    constructor(public persistentMemory: PersistentMemory) {}

    async getByID(id: EntryID): Promise<Entry | null> {
        return this.persistentMemory.getEntryByID(id);
    }

    async create(request: EntryCreationRequest): Promise<EntryID> {
        assertValidEntryCreationRequest(request);
        return this.persistentMemory.create(request);
    }
}
