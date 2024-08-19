import { createRoot } from "react-dom/client";

import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { App } from "./pages/App";

const theme = createTheme({
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
