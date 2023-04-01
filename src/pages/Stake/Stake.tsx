import { VStack } from "@chakra-ui/react";
import React from "react";
import { StakingUI } from "../../components";

export const Stake = () => {
  return (
    <VStack minH="100vh" w="full">
      <StakingUI />
    </VStack>
  );
};
