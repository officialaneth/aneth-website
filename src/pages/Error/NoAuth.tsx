import { Flex, HStack, Heading, VStack } from "@chakra-ui/react";
import React from "react";
import { ConnectWalletButton } from "../../components";

export const NoAuth = () => {
  return (
    <Flex w="full" flex={1} align="center" justify="center">
      <VStack>
        <Heading size="md">Please connect wallet to continue.</Heading>
        <ConnectWalletButton />
      </VStack>
    </Flex>
  );
};
