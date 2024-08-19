import { Container } from "@mantine/core";
import { Header } from "./components/Header";
import { AddMadamisButton } from "./components/AddMadamis";
import { MadamisList } from "./components/MadamisList";

export const App = () => {
  return (
    <>
      <Header />
      <AddMadamisButton />
      <Container>
        <MadamisList />
      </Container>
    </>
  );
};
