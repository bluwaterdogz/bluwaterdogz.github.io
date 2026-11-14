import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { reactClickToComponent } from "vite-plugin-react-click-to-component";
// import { visualizer } from "rollup-plugin-visualizer";

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
    reactClickToComponent(),
    // visualizer({
    //   filename: "bundle-stats.html",
    //   open: true,
    //   gzipSize: true,
    //   brotliSize: true,
    //   template: "treemap",
    // }),
  ],
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
}));
