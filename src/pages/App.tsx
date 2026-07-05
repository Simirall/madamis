import { Container } from "@yamada-ui/react";
import { GameModal } from "../features/games/components/GameModal";
import { AddMadamisButton } from "../features/madamis/components/AddMadamisButton";
import { MadamisContainer } from "../features/madamis/components/MadamisList";
import { MadamisModal } from "../features/madamis/components/MadamisModal";
import { Header } from "./components/Header";

export const App = () => {
  return (
    <>
      <Header />
      <AddMadamisButton />
      <Container.Root maxW="full" minH="full" p="4">
        <MadamisContainer />
      </Container.Root>
      <MadamisModal />
      <GameModal />
    </>
  );
};
