import { Container } from "@yamada-ui/react";
import { GameModal } from "./components/games/GameModal";
import { Header } from "./components/Header";
import { AddMadamisButton } from "./components/madamis/AddMadamisButton";
import { MadamisContainer } from "./components/madamis/MadamisList";
import { MadamisModal } from "./components/madamis/MadamisModal";

export const App = () => {
  return (
    <>
      <Header />
      <AddMadamisButton />
      <Container.Root maxW="full">
        <MadamisContainer />
      </Container.Root>
      <MadamisModal />
      <GameModal />
    </>
  );
};
