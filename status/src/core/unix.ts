import { execSync } from "child_process";

/**
 * Get the current Unix user running the process
 */
export const getUnixUser = (): string => {
  try {
    const user = execSync("whoami", { encoding: "utf-8" }).trim();
    return user;
  } catch (error) {
    throw new Error("Failed to get Unix user");
  }
};
