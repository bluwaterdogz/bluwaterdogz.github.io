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

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.remove("theme-light", "theme-dark");
  document.documentElement.classList.add(`theme-${theme}`);
};

const savedTheme = initialTheme();
applyTheme(savedTheme);

export const useThemeStore = create<ThemeState>((set) => ({
  theme: savedTheme,
  toggleTheme: () =>
    set(({ theme }) => {
      const nextTheme = theme === "light" ? "dark" : "light";
      window.localStorage.setItem("theme", nextTheme);
      applyTheme(nextTheme);
      return { theme: nextTheme };
    }),
}));
