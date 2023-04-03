import { Flex, Hide, useColorModeValue } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { NavUser } from "../../components";

export const User = () => {
  return (
    <Flex w="full" py={10} gap={10} p={5}>
      <Hide below="md">
        <NavUser />
      </Hide>
      <Flex
        flex={1}
        bgColor={useColorModeValue("gray.50", "gray.900")}
        borderRadius="50px"
        p={5}
      >
        <Outlet></Outlet>
      </Flex>
    </Flex>
  );
};
