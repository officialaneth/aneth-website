import { Heading } from "@chakra-ui/react";
import { BalancesCard, CardContainer } from "../../../../components/UI";
import { useSupportedNetworkInfo } from "../../../../constants";
import { useTotalRewardPaid } from "../../../../hooks/ReferralHooks";

export const UserIncome = ({
  account,
  chainId,
  currentNetwork,
}: {
  account: string;
  chainId: number;
  currentNetwork: typeof useSupportedNetworkInfo;
}) => {
  const userTotalRewardPaid = useTotalRewardPaid(account);
  return (
    <CardContainer>
      <Heading size="sm">Your Income</Heading>
      <BalancesCard
        currencyName={"Referral Income"}
        currencyValue={`${userTotalRewardPaid.rewardsAUSD.toFixed(3)} ${
          currentNetwork[chainId]?.ANUSD?.Symbol
        }`}
      ></BalancesCard>
      <BalancesCard
        currencyName={"Self Income Pool"}
        currencyValue={`${userTotalRewardPaid.rewardsPassive.toFixed(3)} ${
          currentNetwork[chainId]?.ANUSD?.Symbol
        }`}
      ></BalancesCard>
      <BalancesCard
        currencyName={"Global Income Pool"}
        currencyValue={`${userTotalRewardPaid.rewardsGlobal.toFixed(3)} ${
          currentNetwork[chainId]?.ANUSD?.Symbol
        }`}
      ></BalancesCard>
      
    </CardContainer>
  );
};
