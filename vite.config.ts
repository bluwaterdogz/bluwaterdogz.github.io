import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { reactClickToComponent } from "vite-plugin-react-click-to-component";

// https://vite.dev/config/

export default defineConfig(({ command }) => ({
  css: {
    devSourcemap: true,
  },
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
    reactClickToComponent(),
  ],
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
}));
