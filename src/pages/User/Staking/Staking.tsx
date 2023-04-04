import { Heading, VStack, Wrap } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import React from "react";
import { CardContainer } from "../../../components/UI";
import { useSupportedNetworkInfo } from "../../../constants";
import { StakingIDCard } from "./StakingIDCard/StakingIDCard";

export const Staking = () => {
  const { account, chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  return (
    <VStack w="full" spacing={10}>
      <StakingIDCard
        tokenSymbol={currentNetwork?.Token?.Symbol}
        anusdSymbol={currentNetwork?.ANUSD?.Symbol}
      ></StakingIDCard>
    </VStack>
  );
};
