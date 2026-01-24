import { EntryCreationRequest, EntryID } from "@domain/entry";

export class API {
    constructor(private baseURL: string = "") {}

    async create(request: EntryCreationRequest): Promise<EntryID> {
        const response = await fetch(`${this.baseURL}/api/entries`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create entry");
        }

        const data = await response.json();
        return data.id;
    }
}
