#!/usr/bin/env node

import { bootstrap } from "@bootstrap";

const args = process.argv.slice(2);

async function main(): Promise<number> {
    const command = args[0];

    const { entries, persistentMemory } = await bootstrap();

    if (command === "run-migrations") {
        await persistentMemory.runMigrations();
        return 0;
    }

    if (command === "create") {
        const resource = args[1];
        if (resource === "entry") {
            try {
                // Read JSON from stdin
                const stdinData = await new Promise<string>(
                    (resolve, reject) => {
                        let data = "";
                        process.stdin.on("data", (chunk) => {
                            data += chunk;
                        });
                        process.stdin.on("end", () => {
                            resolve(data);
                        });
                        process.stdin.on("error", reject);
                    }
                );

                const request = JSON.parse(stdinData);
                const id = await entries.create(request);
                console.log(id);
                return 0;
            } catch (error) {
                if (error instanceof Error) {
                    console.error(`Error: ${error.message}`);
                } else {
                    console.error("Error: Unknown error occurred");
                }
                return 1;
            }
        }
    }

    if (command === "get") {
        const resource = args[1];
        if (resource === "entry") {
            const id = args[2];
            if (!id) {
                console.error("Error: Entry ID is required");
                console.error("Usage: paste-bin-clone get entry {id}");
                return 1;
            }

            const entry = await entries.getByID(id);

            if (!entry) {
                console.error(`Entry not found: ${id}`);
                return 1;
            }

            console.log(JSON.stringify(entry, null, 2));
            return 0;
        }
    }

    console.error("Usage:");
    console.error("  paste-bin-clone run-migrations");
    console.error("  paste-bin-clone create entry < data.json");
    console.error("  paste-bin-clone get entry {id}");
    return 1;
}

main()
    .then((exitCode) => process.exit(exitCode))
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });
