import { describe, expect, it } from "vitest";

import { User, userHasTeacherInfo, userIsTeacher } from "./user";

describe("userHasTeacherInfo", () => {
  it("should return true when teacher field is null", () => {
    const user: User = {
      id: "1",
      username: "testuser",
      teacher: null,
    };
    expect(userHasTeacherInfo(user)).toBe(true);
  });

  it("should return true when teacher field is an object", () => {
    const user: User = {
      id: "1",
      username: "testuser",
      teacher: {},
    };
    expect(userHasTeacherInfo(user)).toBe(true);
  });

  it("should return false when teacher field is undefined", () => {
    const user: User = {
      id: "1",
      username: "testuser",
    };
    expect(userHasTeacherInfo(user)).toBe(false);
  });
});

describe("userIsTeacher", () => {
  it("should return false when user is not a teacher", () => {
    const user: User = {
      id: "1",
      username: "testuser",
      teacher: null,
    };
    expect(userIsTeacher(user)).toBe(false);
  });

  it("should return true when user is a teacher", () => {
    const user: User = {
      id: "1",
      username: "testuser",
      teacher: {},
    };
    expect(userIsTeacher(user)).toBe(true);
  });

  it("should throw error when teacher info is not available", () => {
    const user: User = {
      id: "1",
      username: "testuser",
    };
    expect(() => userIsTeacher(user)).toThrow(
      "Teacher info not available. Call userHasTeacherInfo first."
    );
  });
});
