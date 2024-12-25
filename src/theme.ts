import { type ThemeConfig, extendTheme } from "@yamada-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: `"Yusei Magic", sans-serif`,
    body: `"Yusei Magic", sans-serif`,
  },
})();

export const config: ThemeConfig = {
  initialColorMode: "system",
};
