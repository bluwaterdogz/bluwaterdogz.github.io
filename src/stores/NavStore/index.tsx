import { create } from "zustand";

interface NavState {
  navOpen: boolean;
  setNavOpen: (value: boolean) => void;
}

export const useNaveStore = create<NavState>((set) => ({
  navOpen: false,
  setNavOpen: (value: boolean) => {
    set({ navOpen: value });
  },
}));
