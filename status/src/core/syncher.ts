import { docker } from "./docker";
import { canSyncInstance } from "./permission";
import { postgres } from "@core/postgres";
import { apps } from "@core/apps";
import { errorMessage } from "@domain/errors";

export const syncher = new (class Syncher {
  validateUser(): void {
    if (!canSyncInstance()) {
      throw new Error("Permission denied: sync-instance can only be run by the 'syncher' user");
    }
  }

  async sync(): Promise<boolean> {
    this.validateUser();

    const dockerUp = await docker.isUp();
    if (!dockerUp) {
      throw new Error("Docker is not running");
    }

    await this.ensurePostgresIsAvailable()

    for (const app of apps) {
      if (!await app.container.exists()) {
        throw new Error(`${app.name} container does not exist`);
      }

      if (!(await app.container.isUp())) {
        throw new Error(`${app.name}'s container is not up`);
      }

      console.log("TODO: Check app's hash commit agains current to see if different, build image if needed and deploy")
    }

    console.log("TODO: check DBs are in same docker network");

    console.log("TODO: check DBs are in same docker network");

    console.log("TODO: ping public URLs")

    console.log("synched ok :)");
    return true;
  }

  private async ensurePostgresIsAvailable(): Promise<void> {
    if (!await postgres.container.exists()) {
      throw new Error("postgres container does not exists");
    }

    if (!(await postgres.container.isUp())) {
      try {
        await postgres.container.start();
      } catch (error) {
        throw new Error(`postgres container is not up and could not be started: ${errorMessage(error)}`);
      }

      const pool = postgres.server.getPostgresDB();

      let pingOk = false;
      const startTime = Date.now();
      while (Date.now() - startTime < 2000) {
        try {
          await pool.ping();
          pingOk = true;
          break;
        } catch (error) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }

      if (!pingOk) {
        throw new Error("postgres container was started but could not be pinged after 2 seconds")
      }
    } else {
      const pool = postgres.server.getPostgresDB();
      try {
        await pool.ping();
      } catch (error) {
        throw new Error(`ping failed: ${errorMessage(error)}`);
      }
    }
  }
})();
