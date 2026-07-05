import { extendTheme, type ThemeConfig } from "@yamada-ui/react";

export const theme = extendTheme({
  fonts: {
    body: `"Yusei Magic", sans-serif`,
    heading: `"Yusei Magic", sans-serif`,
  },
})();

export const config: ThemeConfig = {
  initialColorMode: "system",
};
