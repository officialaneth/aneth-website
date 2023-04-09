import { Heading } from "@chakra-ui/react";
import React from "react";
import { BalancesCard, CardContainer } from "../../../../components/UI";
import { useSupportedNetworkInfo } from "../../../../constants";
import { useUserTotalBusiness } from "../../../../hooks/ReferralHooks";

export const UserBusiness = ({
  account,
  chainId,
  currentNetwork,
}: {
  account: string;
  chainId: number;
  currentNetwork: typeof useSupportedNetworkInfo;
}) => {
  const userTotalBusiness = useUserTotalBusiness(account!);
  return (
    <CardContainer>
      <Heading size="sm">Your Business</Heading>
      <BalancesCard
        currencyName={currentNetwork[chainId]?.ANUSD?.Symbol}
        currencyValue={userTotalBusiness?.totalBusiness.toFixed(3)}
        logo={currentNetwork[chainId]?.ANUSD?.Logo}
      ></BalancesCard>
    </CardContainer>
  );
};
