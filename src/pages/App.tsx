import { ContainerRoot as Container } from "@yamada-ui/react";
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
      <Container maxW="full">
        <MadamisContainer />
      </Container>
      <MadamisModal />
      <GameModal />
    </>
  );
};
