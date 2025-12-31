import { describe, expect, it } from "vitest";

import { Entry, IndexedEntries } from "./models";

interface i {
    getEntries(): IndexedEntries;
}

class Entries {
    private e: IndexedEntries;

    constructor(loader: i) {
        this.e = loader.getEntries();
    }

    *iterate(): Generator<Entry> {
        const years = Array.from(this.e.keys()).sort((a, b) => b - a);

        for (const year of years) {
            const yearMap = this.e.get(year)!;
            const months = Array.from(yearMap.keys()).sort((a, b) => b - a);

            for (const month of months) {
                const monthMap = yearMap.get(month)!;
                const days = Array.from(monthMap.keys()).sort((a, b) => b - a);

                for (const day of days) {
                    yield monthMap.get(day)!;
                }
            }
        }
    }
}

describe("Entries", () => {
    it("entries can be iterated from most recent to least recent", () => {
        const mockIndexedEntries: IndexedEntries = new Map([
            [
                2025,
                new Map([
                    [
                        12,
                        new Map([
                            [29, new Entry(2025, 12, 29, [["first entry"]])],
                            [30, new Entry(2025, 12, 30, [["second entry"]])],
                        ]),
                    ],
                    [
                        1,
                        new Map([
                            [15, new Entry(2025, 1, 15, [["third entry"]])],
                        ]),
                    ],
                ]),
            ],
            [
                2026,
                new Map([
                    [
                        1,
                        new Map([
                            [1, new Entry(2026, 1, 1, [["fourth entry"]])],
                        ]),
                    ],
                ]),
            ],
        ]);

        const mockLoader: i = {
            getEntries: () => mockIndexedEntries,
        };

        const entries = new Entries(mockLoader);
        const result = Array.from(entries.iterate());

        expect(result).toHaveLength(4);
        expect(result[0]).toEqual(new Entry(2026, 1, 1, [["fourth entry"]]));
        expect(result[1]).toEqual(new Entry(2025, 12, 30, [["second entry"]]));
        expect(result[2]).toEqual(new Entry(2025, 12, 29, [["first entry"]]));
        expect(result[3]).toEqual(new Entry(2025, 1, 15, [["third entry"]]));
    });
});
