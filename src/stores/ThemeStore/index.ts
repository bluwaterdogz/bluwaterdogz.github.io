import { create } from "zustand";

export type Theme = "dark" | "light";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

const initialTheme = (): Theme => {
  const savedTheme = window.localStorage.getItem("theme");
  return savedTheme === "dark" ? "dark" : "light";
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme(),
  toggleTheme: () =>
    set(({ theme }) => {
      const nextTheme = theme === "light" ? "dark" : "light";
      window.localStorage.setItem("theme", nextTheme);
      return { theme: nextTheme };
    }),
}));
