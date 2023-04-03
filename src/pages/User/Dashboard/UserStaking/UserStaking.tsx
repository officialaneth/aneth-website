import { Heading } from "@chakra-ui/react";
import React from "react";
import { BalancesCard, CardContainer } from "../../../../components/UI";
import { useSupportedNetworkInfo } from "../../../../constants";

export const UserStaking = ({
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
      <Heading size="sm">Your Staking</Heading>
      <BalancesCard
        currencyName={"Value Staked"}
        currencyValue="1000"
        isLoaded={true}
      ></BalancesCard>
      <BalancesCard
        currencyName={"Pending Reward"}
        currencyValue="1000"
        isLoaded={true}
      ></BalancesCard>
      <BalancesCard
        currencyName={"Reward Claimed"}
        currencyValue="1000"
        isLoaded={true}
      ></BalancesCard>
    </CardContainer>
  );
};
