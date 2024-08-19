import { Container } from "@mantine/core";
import { Header } from "./components/Header";
import { AddMadamisButton } from "./components/AddMadamis";

export const App = () => {
  return (
    <>
      <Header />
      <AddMadamisButton />
      <Container></Container>
    </>
  );
};
