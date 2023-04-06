import { Box, useColorModeValue, VStack } from "@chakra-ui/react";
import React from "react";
import { Header } from "./Header/Header";
import { PresaleStatus } from "./PresaleStatus/PresaleStatus";
import { ReferAndEarn } from "./ReferAndEarn/ReferAndEarn";
import { Roadmap } from "./Roadmap/Roadmap";
import { Tokenomics } from "./Tokenomics/Tokenomics";

export const HomePage = () => {
  return (
    <VStack w="full" spacing={0}>
      <Header />
      <PresaleStatus />
      <Tokenomics />

      <Roadmap />
      <ReferAndEarn></ReferAndEarn>
    </VStack>
  );
};
