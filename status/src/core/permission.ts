import { getUnixUser } from "./unix";

/**
 * Check if the current user has permission to sync the instance
 */
export const canSyncInstance = (): boolean => {
  const ALLOWED_USER = "syncher";
  const currentUser = getUnixUser();
  return currentUser === ALLOWED_USER;
};
