import { Heading } from "@chakra-ui/react";
import React from "react";
import { BalancesCard, CardContainer } from "../../../../components/UI";
import { useSupportedNetworkInfo } from "../../../../constants";

export const UserBusiness = ({
  account,
  chainId,
  currentNetwork,
}: {
  account: string;
  chainId: number;
  currentNetwork: typeof useSupportedNetworkInfo;
}) => {
  return (
    <CardContainer>
      <Heading size="sm">Your Business</Heading>
      <BalancesCard
        currencyName={currentNetwork[chainId]?.ANUSD?.Symbol}
        currencyValue="1000"
        logo={currentNetwork[chainId]?.ANUSD?.Logo}
      ></BalancesCard>
    </CardContainer>
  );
};
