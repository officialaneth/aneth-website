import { useCall, useEthers } from "@usedapp/core";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { AddressZero, useSupportedNetworkInfo } from "../constants";

const useCallHook = (methodName: string, arg: any[]) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const { value, error } =
    useCall(
      currentNetwork?.stakingContractAddress && {
        contract: currentNetwork?.stakingContractInterface,
        method: methodName,
        args: arg,
      }
    ) ?? {};

  if (error) {
    console.error("Staking Hooks", error.message);
    return undefined;
  }
  return value;
};

export const useStakingUserAccountMap = (
  account: string
): {
  isDisabled: boolean;
  stakingIDs: BigNumber[] | [];
  blockNumbers: BigNumber[] | [];
} => {
  const value = useCallHook("userAccountMap", [account]);
  const valueObject = {
    isDisabled: value ? value?.[0]?.isDisabled : false,
    stakingIDs: value ? value?.[0]?.stakingID : [],
    blockNumbers: value ? value?.[0]?.blockNumber : [],
  };
  return valueObject;
};

export const useStakeInfoMap = (
  stakingID: string
): {
  blockNumbers: BigNumber[] | [];
  duration: number;
  isStaked: boolean;
  lastTimeRewardClaimed: number;
  owner: string;
  rewardClaimed: number;
  rewardClaimedANUSD: number;
  rewardRate: number;
  startTime: number;
  value: number;
} => {
  const value = useCallHook("stakeInfoMap", [stakingID]);
  const valueObject = {
    blockNumbers: value ? value?.[0].blockNumber : [],
    duration: value ? Number(value?.[0].duration?.toString()) : 0,
    isStaked: value ? value?.[0]?.isStaked : false,
    lastTimeRewardClaimed: value
      ? Number(value?.[0].lastTimeRewardClaimed.toString())
      : 0,
    owner: value ? value?.[0]?.owner : AddressZero,
    rewardClaimed: value ? Number(formatEther(value?.[0].rewardClaimed)) : 0,
    rewardClaimedANUSD: value
      ? Number(formatEther(value?.[0].rewardClaimedAUSD))
      : 0,
    rewardRate: value ? Number(value?.[0].rewardRate.toString()) : 0,
    startTime: value ? Number(value?.[0].startTime.toString()) : 0,
    value: value ? Number(formatEther(value?.[0].value)) : 0,
  };
  return valueObject;
};

export const useGetStakingReward = (stakingID: string | number) => {
  const value = useCallHook("getStakingReward", [stakingID]);
  const valueFormatted = value ? Number(formatEther(value?.[0])) : 0;
  return valueFormatted;
};

export const useGetAllStakingRewards = (address: string) => {
  const value = useCallHook("getUserAllStakingsRewards", [address]);
  const valueFormatted = value ? Number(formatEther(value?.[0])) : 0;
  return valueFormatted;
};

export const useGetUserTotalStakedValue = (address: string) => {
  const value = useCallHook("getUserTotalStakedValue", [address]);
  const valueFormatted = value ? Number(formatEther(value?.[0])) : 0;
  return valueFormatted;
};

export const useGetUserTotalRewardClaimed = (address: string) => {
  const value = useCallHook("getUserTotalRewardClaimed", [address]);
  const valueFormatted = value ? Number(formatEther(value?.[0])) : 0;
  return valueFormatted;
};
