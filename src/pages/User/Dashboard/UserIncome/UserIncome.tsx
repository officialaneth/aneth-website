import { Heading } from "@chakra-ui/react";
import React from "react";
import { BalancesCard, CardContainer } from "../../../../components/UI";
import { useSupportedNetworkInfo } from "../../../../constants";

export const UserIncome = ({
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
      <Heading size="sm">Your Income</Heading>
      <BalancesCard
        currencyName={"Referral Income"}
        currencyValue="1000"
        isLoaded={true}
      ></BalancesCard>
      <BalancesCard
        currencyName={"Global Income"}
        currencyValue="1000"
        isLoaded={true}
      ></BalancesCard>
    </CardContainer>
  );
};
