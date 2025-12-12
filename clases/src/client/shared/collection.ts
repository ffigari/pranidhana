import { StoreApi, UseBoundStore, create } from "zustand";

type CollectionState<T extends { id: string }> = {
  collection: T[];
  add: (t: T) => void;
  remove: (id: string) => void;
  setAll: (items: T[]) => void;
};

export type Collection<T extends { id: string }> = UseBoundStore<
  StoreApi<CollectionState<T>>
>;

export const createCollection = <T extends { id: string }>() =>
  create<CollectionState<T>>((set) => ({
    collection: [],
    add: (t: T) =>
      set((s) => ({
        collection: s.collection.filter(({ id }) => t.id != id).concat([t]),
      })),
    remove: (id: string) =>
      set((s) => ({
        collection: s.collection.filter(
          ({ id: existingID }) => existingID != id
        ),
      })),
    setAll: (items: T[]) =>
      set(() => ({
        collection: items,
      })),
  }));
