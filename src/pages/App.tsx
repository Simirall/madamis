import { Container } from "@mantine/core";
import { Header } from "./components/Header";
import { AddMadamisButton } from "./components/AddMadamisButton";
import { MadamisList } from "./components/MadamisList";
import { MadamisModal } from "./components/MadamisModal";
import { GameModal } from "./components/GameModal";

export const App = () => {
  return (
    <>
      <Header />
      <AddMadamisButton />
      <Container size="100%">
        <MadamisList />
      </Container>
      <MadamisModal />
      <GameModal />
    </>
  );
};
