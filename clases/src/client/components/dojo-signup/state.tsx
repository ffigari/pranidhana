import { create } from "zustand";

import { createUsersSearcher } from "../../shared/users";

const minStep = 0;
const maxStep = 2;

export const useStore = create<{
  activeStep: number;
  dojoName: string;
  setDojoName: (newName: string) => void;
  advance: () => void;
  goBack: () => void;
}>((set) => ({
  activeStep: minStep,
  dojoName: "",
  setDojoName: (newName: string) => set((_) => ({ dojoName: newName })),
  advance: () =>
    set((s) => ({ activeStep: Math.min(maxStep, s.activeStep + 1) })),
  goBack: () =>
    set((s) => ({ activeStep: Math.max(minStep, s.activeStep - 1) })),
}));

export const {
  useUsersCollection: useAdminsCollection,
  UsersSearcher: AdminsSearcher,
} = createUsersSearcher({
  onlyTeachers: false,
  label: "Buscar administradores",
});

export const {
  useUsersCollection: useTeachersCollection,
  UsersSearcher: TeachersSearcher,
} = createUsersSearcher({
  onlyTeachers: true,
  label: "Buscar profesores",
});
