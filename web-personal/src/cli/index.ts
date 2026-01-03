#!/usr/bin/env node

import { listLogEntries } from "./log";

interface C {
    name: string;
    command: () => void;
}

const cs: C[] = [
    {
        name: "status",
        command: () => console.log("ok"),
    },
    {
        name: "list-log-entries",
        command: listLogEntries,
    },
];

function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        cs.map(({ name }) => name).forEach((n) => console.log(n));
        return;
    }

    const inputName = args[0];

    const c: C | undefined = cs.find(({ name }) => name == inputName);
    if (!c) {
        console.error(`Error: Unknown command '${inputName}'`);
        process.exit(1);
    }

    c.command();
}

main();
