import { Box, Container } from "@yamada-ui/react";
import { GameModal } from "../features/games/components/GameModal";
import { AddMadamisButton } from "../features/madamis/components/AddMadamisButton";
import { MadamisContainer } from "../features/madamis/components/MadamisList";
import { MadamisModal } from "../features/madamis/components/MadamisModal";
import { ScrollToTopButton } from "../shared/components/ScrollToTopButton";
import { Header } from "./components/Header";

export const App = () => {
  return (
    <Box bg={["gray.50", "black"]} minH="100vh">
      <Header />
      <AddMadamisButton />
      <ScrollToTopButton />
      <Container.Root maxW="full" minH="full" p="4">
        <MadamisContainer />
      </Container.Root>
      <MadamisModal />
      <GameModal />
    </Box>
  );
};
