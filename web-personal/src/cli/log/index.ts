import { Entries } from "@log";

import { loader } from "./loader";

export const listLogEntries = () => {
    const entries = new Entries(loader);

    for (const entry of entries.iterate()) {
        console.log(
            `\n=== ${entry.year}-${entry.month.toString().padStart(2, "0")}-${entry.day.toString().padStart(2, "0")} ===\n`
        );

        for (const paragraph of entry.paragraphs) {
            for (const line of paragraph) {
                console.log(line);
            }
            console.log();
        }
    }
};
