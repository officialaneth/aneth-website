import { VStack } from "@chakra-ui/react";
import React from "react";
import { SwapUI } from "../../components";

export const SwapPage = () => {
  return (
    <VStack w="full" minH="100vh" py={50} px={5}>
      <SwapUI />
    </VStack>
  );
};
