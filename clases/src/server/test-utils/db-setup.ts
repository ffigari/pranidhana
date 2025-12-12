import * as fs from "fs";
import * as path from "path";
import { Pool } from "pg";

export class TestDatabase {
  private adminPool: Pool;
  private testPool: Pool | null = null;
  private dbName: string;

  constructor(testFileName: string) {
    this.dbName = `clases_test_${testFileName}`;

    this.adminPool = new Pool({
      user: process.env.PGUSER || "figari",
      host: process.env.PGHOST || "localhost",
      database: "postgres",
      password: process.env.PGPASSWORD,
      port: parseInt(process.env.PGPORT || "5432", 10),
    });
  }

  async setup(): Promise<Pool> {
    await this.dropDatabase();
    await this.createDatabase();
    await this.runMigrations();
    return this.getPool();
  }

  async cleanup(): Promise<void> {
    if (this.testPool) {
      await this.testPool.end();
      this.testPool = null;
    }
    await this.dropDatabase();
    await this.adminPool.end();
  }

  getPool(): Pool {
    if (!this.testPool) {
      this.testPool = new Pool({
        user: process.env.PGUSER || "figari",
        host: process.env.PGHOST || "localhost",
        database: this.dbName,
        password: process.env.PGPASSWORD,
        port: parseInt(process.env.PGPORT || "5432", 10),
      });
    }
    return this.testPool;
  }

  private async dropDatabase(): Promise<void> {
    try {
      await this.adminPool.query(`DROP DATABASE IF EXISTS ${this.dbName}`);
    } catch (error) {
      console.error(`Failed to drop database ${this.dbName}:`, error);
    }
  }

  private async createDatabase(): Promise<void> {
    await this.adminPool.query(`CREATE DATABASE ${this.dbName}`);
  }

  private async runMigrations(): Promise<void> {
    const migrationsDir = path.resolve(__dirname, "../../../migrations");
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    const pool = this.getPool();

    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      await pool.query(sql);
    }
  }
}
