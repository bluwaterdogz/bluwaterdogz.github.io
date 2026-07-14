import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


// https://vite.dev/config/

export default defineConfig(({ command }) => ({
  plugins: [
    react({
      babel: {
        plugins:
          command === "serve"
            ? [
                [
                  "@locator/babel-jsx/dist",
                  {
                    env: "development",
                  },
                ],
              ]
            : [],
      },
    }),
  ],
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
}));