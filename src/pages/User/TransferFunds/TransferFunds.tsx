import { VStack } from "@chakra-ui/react";
import React from "react";
import { TransferFundsUI } from "../../../components";

export const TransferFunds = () => {
  return (
    <VStack w="full" py={10}>
      <TransferFundsUI />;
    </VStack>
  );
};
