import { Container } from "@yamada-ui/react";
import { Header } from "./components/Header";
import { GameModal } from "./components/games/GameModal";
import { AddMadamisButton } from "./components/madamis/AddMadamisButton";
import { MadamisContainer } from "./components/madamis/MadamisList";
import { MadamisModal } from "./components/madamis/MadamisModal";

export const App = () => {
  return (
    <>
      <Header />
      <AddMadamisButton />
      <Container size="100%">
        <MadamisContainer />
      </Container>
      <MadamisModal />
      <GameModal />
    </>
  );
};
