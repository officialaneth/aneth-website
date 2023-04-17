import { Heading } from "@chakra-ui/react";
import React from "react";
import { FaPiggyBank } from "react-icons/fa";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { BalancesCard, CardContainer } from "../../../../components/UI";
import { useSupportedNetworkInfo } from "../../../../constants";
import {
  useGetAllStakingRewards,
  useGetUserTotalRewardClaimedANUSD,
  useGetUserTotalStakedValue,
} from "../../../../hooks/StakingHooks";

export const UserStaking = ({
  account,
  chainId,
  currentNetwork,
}: {
  account: string;
  chainId: number;
  currentNetwork: typeof useSupportedNetworkInfo;
}) => {
  const userAllStakingRewards = useGetAllStakingRewards(account);
  const userTotalStakedValue = useGetUserTotalStakedValue(account);
  const userTotalRewardClaimed = useGetUserTotalRewardClaimedANUSD(account);
  return (
    <CardContainer>
      <Heading size="sm">Your Staking</Heading>
      <BalancesCard
        currencyName={"Value Staked"}
        currencyValue={`${userTotalStakedValue.toFixed(3)} ${
          currentNetwork[chainId]?.Token?.Symbol
        }`}
        icon={FaPiggyBank}
      ></BalancesCard>
      <BalancesCard
        currencyName={"Pending Reward"}
        currencyValue={`${userAllStakingRewards.toFixed(3)} ${
          currentNetwork[chainId]?.Token?.Symbol
        }`}
        icon={GiPayMoney}
      ></BalancesCard>
      <BalancesCard
        currencyName={"Reward Claimed"}
        currencyValue={`${
          userTotalRewardClaimed > 0 ? userTotalRewardClaimed.toFixed(5) : "0"
        } ${currentNetwork[chainId]?.Token?.Symbol}`}
        icon={GiReceiveMoney}
      ></BalancesCard>
    </CardContainer>
  );
};
