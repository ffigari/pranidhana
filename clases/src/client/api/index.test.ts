import { Class, PaginatedClasses } from "@shared/class";
import { Teacher } from "@shared/teachers";
import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { API } from "./index";

vi.mock("axios");

describe("API", () => {
  let api: API;
  const baseURL = "http://localhost:3000";

  beforeEach(() => {
    api = new API(baseURL);
    vi.clearAllMocks();
  });

  describe("getClasses", () => {
    it("should fetch classes without cursor and without teachers", async () => {
      const mockData = new PaginatedClasses(
        [new Class(1), new Class(2)],
        "cursor-1",
        true
      );

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockData });

      const result = await api.getClasses(null, false);

      expect(axios.get).toHaveBeenCalledWith(`${baseURL}/api/classes`, {
        params: {
          limit: 2,
        },
      });
      expect(result).toEqual(mockData);
    });

    it("should fetch classes without cursor but with teachers", async () => {
      const mockData = new PaginatedClasses(
        [
          new Class(1, [new Teacher(1), new Teacher(2)]),
          new Class(2, [new Teacher(3)]),
        ],
        "cursor-1",
        true
      );

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockData });

      const result = await api.getClasses(null, true);

      expect(axios.get).toHaveBeenCalledWith(`${baseURL}/api/classes`, {
        params: {
          limit: 2,
          include: "teachers",
        },
      });
      expect(result).toEqual(mockData);
    });

    it("should fetch classes with cursor and without teachers", async () => {
      const mockData = new PaginatedClasses(
        [new Class(3), new Class(4)],
        "cursor-2",
        true
      );

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockData });

      const result = await api.getClasses("cursor-1", false);

      expect(axios.get).toHaveBeenCalledWith(`${baseURL}/api/classes`, {
        params: {
          limit: 2,
          cursor: "cursor-1",
        },
      });
      expect(result).toEqual(mockData);
    });

    it("should fetch classes with cursor and with teachers", async () => {
      const mockData = new PaginatedClasses(
        [
          new Class(3, [new Teacher(1)]),
          new Class(4, [new Teacher(2), new Teacher(3)]),
        ],
        "cursor-2",
        false
      );

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockData });

      const result = await api.getClasses("cursor-1", true);

      expect(axios.get).toHaveBeenCalledWith(`${baseURL}/api/classes`, {
        params: {
          limit: 2,
          cursor: "cursor-1",
          include: "teachers",
        },
      });
      expect(result).toEqual(mockData);
    });
  });
});
