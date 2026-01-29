import { Pool } from "pg";

export class BaseDB {
  constructor(
    private pool: Pool,
    private port: number
  ) {}

  async ping(): Promise<boolean> {
    try {
      await this.pool.query("SELECT 1");
      return true;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ECONNREFUSED") {
        throw new Error(
          `Postgres connection refused. Check credentials and port are correct. ${this.port} was used.`
        );
      }
      throw error;
    }
  }
}
