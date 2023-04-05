import { Flex, useColorModeValue, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Footer, Nav } from "./components";

export const App = () => (
  <Flex
    bgColor={useColorModeValue("gray.200", "gray.800")}
    direction="column"
    minH="100dvh"
    gap={5}
  >
    <Nav />
    <Outlet />
    <Footer />
  </Flex>
);
