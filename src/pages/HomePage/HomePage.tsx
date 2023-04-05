import { VStack } from "@chakra-ui/react";
import React from "react";
import { Header } from "./Header/Header";
import { Tokenomics } from "./Tokenomics/Tokenomics";

export const HomePage = () => {
  return (
    <VStack w="full">
      <Header />
      <Tokenomics />
    </VStack>
  );
};
