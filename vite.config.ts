import build from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      build: {
        rollupOptions: {
          input: "./src/client.tsx",
          output: {
            assetFileNames: "static/assets/[name].[ext]",
            chunkFileNames: "static/assets/[name]-[hash].js",
            entryFileNames: "static/client.js",
          },
          plugins: [
            react(),
            babel({
              presets: [reactCompilerPreset()],
            }),
          ],
        },
      },
    };
  }

  return {
    plugins: [
      build(),
      devServer({
        adapter,
        entry: "src/index.tsx",
      }),
    ],
    ssr: {
      external: ["react", "react-dom"],
    },
  };
});
