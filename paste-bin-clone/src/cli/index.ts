#!/usr/bin/env node

import { Entries } from "@core/entries";

const args = process.argv.slice(2);

if (args.length < 3) {
  console.error("Usage: paste-bin-clone get entry {id}");
  process.exit(1);
}

const [command, resource, id] = args;

if (command !== "get") {
  console.error(`Unknown command: ${command}`);
  console.error("Usage: paste-bin-clone get entry {id}");
  process.exit(1);
}

if (resource !== "entry") {
  console.error(`Unknown resource: ${resource}`);
  console.error("Usage: paste-bin-clone get entry {id}");
  process.exit(1);
}

const entries = new Entries();
const entry = entries.getByID(id);

if (!entry) {
  console.error(`Entry not found: ${id}`);
  process.exit(1);
}

console.log(JSON.stringify(entry, null, 2));
