import { Flex, useColorModeValue } from "@chakra-ui/react";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer, Nav } from "./components";

export const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return (
    <Flex
      bgColor={useColorModeValue("gray.100", "gray.800")}
      direction="column"
      minH="100dvh"
      gap={5}
    >
      <Nav />
      <Outlet />
      <Footer />
    </Flex>
  );
};
