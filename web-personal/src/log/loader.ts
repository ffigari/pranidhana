import { IndexedEntries } from "./models";
import { parseEntry } from "./parsing";

class DiskLoader {
    getEntries(): IndexedEntries {
        const res: IndexedEntries = new Map();

        const entryFiles = import.meta.glob("./entries/**/*", {
            eager: true,
            query: "?raw",
            import: "default",
        });

        for (const [path, content] of Object.entries(entryFiles)) {
            const match = path.match(/\/entries\/(\d+)\/(\d+)\/(\d+)$/);
            if (!match) continue;

            const year = parseInt(match[1], 10);
            const month = parseInt(match[2], 10);
            const day = parseInt(match[3], 10);

            const entry = parseEntry(content as string, year, month, day);

            if (!res.has(year)) {
                res.set(year, new Map());
            }
            const yearMap = res.get(year)!;

            if (!yearMap.has(month)) {
                yearMap.set(month, new Map());
            }
            const monthMap = yearMap.get(month)!;

            monthMap.set(day, entry);
        }

        return res;
    }
}

export const loader = new DiskLoader();
