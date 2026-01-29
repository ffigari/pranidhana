import { describe, it, expect } from "vitest";
import { AppStatus } from "./index";
import { LocalStatus } from "./local-status";

describe("AppStatus.isOK", () => {
  it("should return true when localStatus containerIsUp is true", () => {
    const appName = "test-app";
    const localStatus = new LocalStatus(true);
    const appStatus = new AppStatus(appName, localStatus);

    expect(appStatus.isOK()).toBe(true);
  });

  it("should return false when localStatus containerIsUp is false", () => {
    const appName = "test-app";
    const localStatus = new LocalStatus(false);
    const appStatus = new AppStatus(appName, localStatus);

    expect(appStatus.isOK()).toBe(false);
  });
});
