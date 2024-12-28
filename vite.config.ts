import build from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import babel from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      build: {
        rollupOptions: {
          input: "./src/client.tsx",
          plugins: [
            nodeResolve(),
            babel({
              babelHelpers: "bundled",
              extensions: [".ts", ".tsx"],
              presets: [],
            }),
          ],
          output: {
            entryFileNames: "static/client.js",
            chunkFileNames: "static/assets/[name]-[hash].js",
            assetFileNames: "static/assets/[name].[ext]",
          },
        },
      },
    };
  }

  return {
    ssr: {
      external: ["react", "react-dom"],
    },
    plugins: [
      build(),
      devServer({
        adapter,
        entry: "src/index.tsx",
      }),
    ],
  };
});
