import { EntryCreationRequest, EntryID } from "@domain/entry";

export interface API {
    create(request: EntryCreationRequest): Promise<EntryID>;
}
