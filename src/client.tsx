import { UIProvider } from "@yamada-ui/react";
import { createRoot } from "react-dom/client";
import { App } from "./pages/App";

import { config, theme } from "./theme";

const Index = () => {
  return (
    <>
      <UIProvider config={config} theme={theme}>
        <App />
      </UIProvider>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<Index />);
