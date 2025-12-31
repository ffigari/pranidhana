import { loader } from "./loader";
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

export const entries = new Entries(loader);
