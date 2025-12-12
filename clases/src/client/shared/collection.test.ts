/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createCollection } from "./collection";

describe("collection", () => {
  type TestItem = { id: string; name: string };

  it("should update hook when element is added", () => {
    const useStore = createCollection<TestItem>();

    const { result } = renderHook(() => ({
      collection: useStore((s) => s.collection),
      add: useStore((s) => s.add),
    }));

    expect(result.current.collection).toEqual([]);

    act(() => {
      result.current.add({ id: "1", name: "Item 1" });
    });

    expect(result.current.collection).toEqual([{ id: "1", name: "Item 1" }]);

    act(() => {
      result.current.add({ id: "2", name: "Item 2" });
    });

    expect(result.current.collection).toEqual([
      { id: "1", name: "Item 1" },
      { id: "2", name: "Item 2" },
    ]);
  });

  it("should update hook when element is added", () => {
    type TestItem = { id: string; name: string };
    const useStore = createCollection<TestItem>();

    const { result } = renderHook(() => ({
      collection: useStore((s) => s.collection),
      add: useStore((s) => s.add),
      remove: useStore((s) => s.remove),
    }));

    expect(result.current.collection).toEqual([]);

    act(() => {
      result.current.add({ id: "1", name: "Item 1" });
      result.current.add({ id: "2", name: "Item 2" });
    });

    expect(result.current.collection).toEqual([
      { id: "1", name: "Item 1" },
      { id: "2", name: "Item 2" },
    ]);

    act(() => {
      result.current.remove("2");
    });

    expect(result.current.collection).toEqual([{ id: "1", name: "Item 1" }]);
  });
});
