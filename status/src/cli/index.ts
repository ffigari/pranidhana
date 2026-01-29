#!/usr/bin/env node

import { statusChecker } from "@core/status";
import { syncher } from "@core/syncher";

const main = async () => {
  try {
    const args = process.argv.slice(2);

    if (!args[0]) {
      console.error("Missing command. Available: get, run-migrations, sync-instance");
      process.exit(1);
    }

    if (args[0] === "get") {
      if (args[1] === "status") {
        // No extra params expected for status
        const validParams = args.slice(2).length === 0;
        if (validParams) {
          const status = await statusChecker.getStatus();
          const dto = status.toDTO();
          console.log(JSON.stringify(dto, null, 2));
          process.exit(0);
        } else {
          console.error("Invalid usage. Expected: get status");
          process.exit(1);
        }
      } else {
        console.error(`Unknown resource: ${args[1] || "(missing)"}. Available: status`);
        process.exit(1);
      }
    } else if (args[0] === "sync-instance") {
      try {
        await syncher.sync();
        process.exit(0);
      } catch (error) {
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    } else {
      console.error(`Unknown command: ${args[0]}. Available: get, run-migrations, sync-instance`);
      process.exit(1);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

main();
