import { User } from "./user";

export const errorCodes = {
  nameRequired: "name-required",
  nameTaken: "name-taken",
  invalidNameFormat: "invalid-name-format",
  invalidTeacherId: "invalid-teacher-id",
  noAdmins: "no-admins",
  invalidAdminId: "invalid-admin-id",
  dojoNotFound: "dojo-not-found",
  notAuthorized: "not-authorized",
};

export const dojoNamePattern = /^[a-zA-Z0-9\s]+$/;

export const isValidDojoName = (name: string): boolean => {
  return dojoNamePattern.test(name);
};

export interface DojoWithUsers {
  id: string;
  name: string;
  teachers: User[];
  admins: User[];
}

export interface PaginatedDojosDTO {
  page: DojoWithUsers[];
  beforeCursor: string | null;
  afterCursor: string | null;
}
