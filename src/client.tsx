import { createRoot } from "react-dom/client";
import {
  Badge,
  Button,
  createTheme,
  MantineProvider,
  Title,
} from "@mantine/core";
import { App } from "./pages/App";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

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
        tt: "none",
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
