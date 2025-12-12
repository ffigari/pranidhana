import { isObject } from "./object";

export interface Teacher {}

export interface User {
  id: string;
  username: string;
  teacher?: Teacher | null;
}

export interface PaginatedUsers {
  users: User[];
  nextPageCursor: string | null;
}

export const userHasTeacherInfo = (user: User): boolean => {
  return user.teacher !== undefined;
};

export const userIsTeacher = (user: User): boolean => {
  if (!userHasTeacherInfo(user)) {
    throw new Error(
      "Teacher info not available. Call userHasTeacherInfo first."
    );
  }
  return isObject(user.teacher);
};
