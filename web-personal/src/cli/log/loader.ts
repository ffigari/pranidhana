import { IndexedEntries } from "@log/models";
import { parseEntry } from "@log/parsing";
import { readFileSync, readdirSync, statSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class RuntimeLogEntriesLoader {
    getEntries(): IndexedEntries {
        const res: IndexedEntries = new Map();

        const entriesDir = join(__dirname, "../../log/entries");

        const yearDirs = readdirSync(entriesDir);

        for (const yearDir of yearDirs) {
            const yearPath = join(entriesDir, yearDir);
            if (!statSync(yearPath).isDirectory()) continue;

            const year = parseInt(yearDir, 10);
            if (isNaN(year)) continue;

            const monthDirs = readdirSync(yearPath);

            for (const monthDir of monthDirs) {
                const monthPath = join(yearPath, monthDir);
                if (!statSync(monthPath).isDirectory()) continue;

                const month = parseInt(monthDir, 10);
                if (isNaN(month)) continue;

                const dayFiles = readdirSync(monthPath);

                for (const dayFile of dayFiles) {
                    const dayPath = join(monthPath, dayFile);
                    if (!statSync(dayPath).isFile()) continue;

                    const day = parseInt(dayFile, 10);
                    if (isNaN(day)) continue;

                    const content = readFileSync(dayPath, "utf-8");
                    const entry = parseEntry(content, year, month, day);

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
            }
        }

        return res;
    }
}

export const loader = new RuntimeLogEntriesLoader();
