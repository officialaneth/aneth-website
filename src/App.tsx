import { useColorModeValue, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Footer, Nav } from "./components";

export const App = () => (
  <VStack
    w="full"
    minH="100vh"
    bgColor={useColorModeValue("pink.100", "gray.700")}
  >
    <Nav />
    <Outlet />
    <VStack flex={1}></VStack>
    <Footer />
  </VStack>
);
