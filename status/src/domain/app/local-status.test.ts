import { describe, it, expect } from "vitest";
import { LocalStatus } from "./local-status";

describe("LocalStatus.isOk", () => {
  it("should return true when container is up", () => {
    const localStatus = new LocalStatus(true);

    expect(localStatus.isOk()).toBe(true);
  });

  it("should return false when container is not up", () => {
    const localStatus = new LocalStatus(false);

    expect(localStatus.isOk()).toBe(false);
  });
});
