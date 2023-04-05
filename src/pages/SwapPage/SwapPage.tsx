import { VStack } from "@chakra-ui/react";
import React from "react";
import { SwapUI } from "../../components";

export const SwapPage = () => {
  return (
    <VStack w="full" minH="100vh" py={["100px", "150px"]} px={5}>
      <SwapUI />
    </VStack>
  );
};
