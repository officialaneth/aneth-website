import { useCall, useEthers } from "@usedapp/core";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { AddressZero, useSupportedNetworkInfo } from "../constants";

const useCallHook = (methodName: string, arg: any[]) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const { value, error } =
    useCall(
      currentNetwork?.referralContract && {
        contract: currentNetwork?.referralContractInterface,
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

export const useReferralUserAccount = (
  address: string
): {
  referrer: string;
  referee: string[] | [];
  team: string[] | [];
  selfBusiness: number;
  totalBusiness: number;
  rewardsPaidReferral: BigNumber[] | [];
  rewardsPaidGlobal: BigNumber[] | [];
  rewardPaidPassive: BigNumber[] | [];
  isInGlobalID: boolean;
  blockNumbers: BigNumber[] | [];
} => {
  const value = useCallHook("getUserAccount", [address]);
  const valueObject = {
    referrer: value ? value?.[0]?.referrer : AddressZero,
    referee: value ? value?.[0]?.referee : [],
    team: value ? value?.[0]?.team : [],
    selfBusiness: value ? Number(formatEther(value?.[0]?.selfBusiness)) : 0,
    totalBusiness: value ? Number(formatEther(value?.[0]?.totalBusiness)) : 0,
    rewardsPaidReferral: value ? value?.[0]?.rewardsPaidReferral : [],
    rewardsPaidGlobal: value ? value?.[0]?.rewardsPaidGlobal : [],
    rewardPaidPassive: value ? value?.[0]?.rewardPaidPassive : [],
    isInGlobalID: value ? value?.[0]?.isInGlobalID : false,
    blockNumbers: value ? value?.[0]?.blockNumbers : [],
  };

  return valueObject;
};

export const useTotalRewardPaid = (address: string) => {
  const value = useCallHook("getUserTotalRewardPaid", [address]);
  const valueObject = {
    rewardsAUSD: value ? Number(formatEther(value?.rewardsAUSD)) : 0,
    rewardsGlobal: value ? Number(formatEther(value?.rewardsGlobal)) : 0,
    rewardsPassive: value ? Number(formatEther(value?.rewardsPassive)) : 0,
  };
  return valueObject;
};

export const useUserTotalBusiness = (address: string) => {
  const value = useCallHook("getUserTotalBusiness", [address]);
  const valueobject = {
    totalBusiness: value ? Number(formatEther(value?.totalBusiness)) : 0,
    directBusiness: value ? Number(formatEther(value?.directBusiness)) : 0,
    refereeTeamBusiness: value
      ? Number(formatEther(value?.refereeTeamBusiness))
      : 0,
    teamBusiness: value ? Number(formatEther(value?.teamBusiness)) : 0,
  };

  return valueobject;
};
