import { Container } from "@mantine/core";
import { Header } from "./components/Header";
import { AddMadamisButton } from "./components/AddMadamis";
import { MadamisList } from "./components/MadamisList";
import { MadamisModal } from "./components/MadamisModal";

export const App = () => {
  return (
    <>
      <Header />
      <AddMadamisButton />
      <Container size="lg">
        <MadamisList />
      </Container>
      <MadamisModal />
    </>
  );
};
