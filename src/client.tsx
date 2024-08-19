import { createRoot } from "react-dom/client";

import "@mantine/core/styles.css";
import {
  Badge,
  Button,
  createTheme,
  MantineProvider,
  Title,
} from "@mantine/core";
import { App } from "./pages/App";

const theme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: {
        fw: "normal",
      },
    }),
    Badge: Badge.extend({
      defaultProps: {
        fw: "normal",
      },
    }),
    Title: Title.extend({
      defaultProps: {
        fw: "normal",
      },
    }),
  },
  fontFamily: `"Yusei Magic", sans-serif`,
  headings: { fontFamily: `"Yusei Magic", sans-serif` },
  primaryColor: "lime",
});

const Index = () => {
  return (
    <>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<Index />);
