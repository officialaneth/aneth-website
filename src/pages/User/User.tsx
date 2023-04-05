import { Box, Flex, Hide, useColorModeValue, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { NavUser } from "../../components";

export const User = () => {
  return (
    <Flex w="full" px={5} gap={5} pt={100}>
      <Hide below="md">
        <NavUser />
      </Hide>
      <Flex
        flex={1}
        bgColor={useColorModeValue("gray.50", "gray.900")}
        borderRadius="50px"
        py={10}
        px={5}
        w="full"
      >
        <Outlet></Outlet>
      </Flex>
    </Flex>
  );
};
