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
  blockNumbers: BigNumber[] | [];
  isInGlobalID: boolean;
  referee: string[] | [];
  referrer: string;
  rewardsPaidANUSD: BigNumber[] | [];
  rewardsPaidGlobal: BigNumber[] | [];
  team: string[] | [];
  totalBusinessANUSD: number;
} => {
  const value = useCallHook("getUserAccount", [address]);
  const valueObject = {
    blockNumbers: value ? value?.[0]?.blockNumbers : [],
    isInGlobalID: value ? value?.[0]?.isInGlobalID : false,
    referee: value ? value?.[0]?.referee : [],
    referrer: value ? value?.[0]?.referrer : AddressZero,
    rewardsPaidANUSD: value ? value?.[0]?.rewardsPaidANUSD : [],
    rewardsPaidGlobal: value ? value?.[0]?.rewardsPaidGlobal : [],
    team: value ? value?.[0]?.team : [],
    totalBusinessANUSD: value
      ? Number(formatEther(value?.[0]?.totalBusinessANUSD))
      : 0,
  };

  return valueObject;
};

export const useTotalRewardPaid = (address: string) => {
  const value = useCallHook("getUserTotalRewardPaid", [address]);
  const valueObject = {
    rewardsAUSD: value ? Number(formatEther(value?.rewardsAUSD)) : 0,
    rewardsGlobal: value ? Number(formatEther(value?.rewardsGlobal)) : 0,
  };
  return valueObject;
};

export const useUserTotalBusiness = (address: string) => {
  const value = useCallHook("getUserTotalBusiness", [address]);
  const valueobject = {
    totalBusiness: value ? Number(formatEther(value?.totalBusiness)) : 0,
    directBusiness: value ? Number(formatEther(value?.directBusiness)) : 0,
    teamBusiness: value ? Number(formatEther(value?.teamBusiness)) : 0,
  };

  return valueobject;
};
