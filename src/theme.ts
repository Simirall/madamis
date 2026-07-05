import { defineConfig, extendTheme } from "@yamada-ui/react";

export const theme = extendTheme({
  fonts: {
    body: `"Yusei Magic", sans-serif`,
    heading: `"Yusei Magic", sans-serif`,
  },
});

export const config = defineConfig({
  defaultColorMode: "system",
});
