import { create } from "zustand";
import { User } from "firebase/auth";

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  
  currentProject: any | null;
  setCurrentProject: (project: any | null) => void;

  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  currentProject: null,
  setCurrentProject: (currentProject) => set({ currentProject }),

  theme: "dark",
  setTheme: (theme) => set({ theme }),
}));
