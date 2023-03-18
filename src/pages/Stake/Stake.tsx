import { VStack } from "@chakra-ui/react";
import React from "react";
import { StakingUI } from "../../components";

export const Stake = () => {
  return (
    <VStack flex={1} py={20}>
      <StakingUI />
    </VStack>
  );
};
