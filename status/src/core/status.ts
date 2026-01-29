import { AppStatus } from "@domain/app";
import { LocalStatus } from "@domain/app/local-status";
import { PostgresStatus } from "@domain/postgres";
import { postgres } from "@core/postgres";
import { Status } from "@domain/status";
import { docker } from "./docker";

import { apps } from "@core/apps";

export const statusChecker = new (class {
  async getStatus(): Promise<Status> {
    const dockerUp = await docker.isUp();

    if (!dockerUp) {
      return new Status(false, null, null);
    }

    const postgresStatus = new PostgresStatus(new LocalStatus(await postgres.container.isUp()));

    // Check app containers
    const appStatuses: AppStatus[] = await Promise.all(
      apps.map(async (app) => {
        return new AppStatus(app.name, new LocalStatus(await app.container.isUp()));
      })
    );

    return new Status(dockerUp, postgresStatus, appStatuses);
  }
})();
