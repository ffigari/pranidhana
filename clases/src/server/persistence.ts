import { User } from "@shared/user";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PGUSER || "figari",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "clases",
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || "5432", 10),
});

export const getUser = async (username: string): Promise<User | null> => {
  const result = await pool.query<User>(
    "SELECT id, username FROM users WHERE username = $1",
    [username]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

export const getUserById = async (id: string): Promise<User | null> => {
  const result = await pool.query<User>(
    `SELECT u.id, u.username, (t.user_id IS NOT NULL) as "isTeacher"
     FROM users u
     LEFT JOIN teachers t ON u.id = t.user_id
     WHERE u.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

export const registerTeacher = async (userId: string): Promise<void> => {
  await pool.query(
    "INSERT INTO teachers (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING",
    [userId]
  );
};
