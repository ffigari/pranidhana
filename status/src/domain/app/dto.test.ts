import { describe, it, expect } from "vitest";
import { AppStatus, parseAppStatusDTO } from "./index";
import { LocalStatus, parseLocalStatusDTO } from "./local-status";

describe("DTO conversion", () => {
  describe("LocalStatus", () => {
    it("should convert to DTO correctly", () => {
      const localStatus = new LocalStatus(true);
      const dto = localStatus.toDTO();

      expect(dto).toEqual({ containerIsUp: true });
    });

    it("should parse DTO correctly", () => {
      const dto = { containerIsUp: false };
      const localStatus = parseLocalStatusDTO(dto);

      expect(localStatus).toBeInstanceOf(LocalStatus);
      expect(localStatus.containerIsUp).toBe(false);
      expect(localStatus.isOk()).toBe(false);
    });
  });

  describe("AppStatus", () => {
    it("should convert to DTO with localStatus", () => {
      const appName = "test-app";
      const localStatus = new LocalStatus(true);
      const appStatus = new AppStatus(appName, localStatus);
      const dto = appStatus.toDTO();

      expect(dto).toEqual({
        appName: "test-app",
        localStatus: {
          containerIsUp: true,
        },
      });
    });

    it("should parse DTO correctly", () => {
      const dto = {
        appName: "third-app",
        localStatus: {
          containerIsUp: false,
        },
      };
      const appStatus = parseAppStatusDTO(dto);

      expect(appStatus).toBeInstanceOf(AppStatus);
      expect(appStatus.appName).toBe("third-app");
      expect(appStatus.localStatus).toBeInstanceOf(LocalStatus);
      expect(appStatus.localStatus.containerIsUp).toBe(false);
      expect(appStatus.isOK()).toBe(false);
    });
  });
});
