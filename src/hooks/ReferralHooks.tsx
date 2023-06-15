import { useCall, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { AddressZero, useSupportedNetworkInfo } from '../constants';

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
    console.error('Staking Hooks', error.message);
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
  topUp: BigNumber[] | [];
  selfBusiness: number;
  directBusiness: number;
  totalBusiness: number;
  rewardsPaidReferral: BigNumber[] | [];
  rewardsPaidGlobal: BigNumber[] | [];
  rewardPaidPassive: BigNumber[] | [];
  isInGlobalID: boolean;
  blockNumbers: BigNumber[] | [];
} => {
  const value = useCallHook('getUserAccount', [address]);
  const valueObject = {
    referrer: value ? value?.[0]?.referrer : AddressZero,
    referee: value ? value?.[0]?.referee : [],
    team: value ? value?.[0]?.team : [],
    topUp: value ? value?.[0]?.topUp : [],
    selfBusiness: value ? Number(formatEther(value?.[0]?.selfBusiness)) : 0,
    directBusiness: value ? Number(formatEther(value?.[0]?.directBusiness)) : 0,
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
  const value = useCallHook('getUserTotalRewardPaid', [address]);
  const valueObject = {
    rewardsAUSD: value ? Number(formatEther(value?.rewardsAUSD)) : 0,
    rewardsGlobal: value ? Number(formatEther(value?.rewardsGlobal)) : 0,
    rewardsPassive: value ? Number(formatEther(value?.rewardsPassive)) : 0,
  };
  return valueObject;
};

export const useUserTotalBusiness = (address: string) => {
  const value = useCallHook('getUserTotalBusiness', [address]);
  const valueobject = {
    totalBusiness: value ? Number(formatEther(value?.totalBusiness)) : 0,
    directBusiness: value ? Number(formatEther(value?.directBusiness)) : 0,
    refereeTeamBusiness: value
      ? Number(formatEther(value?.refereeTeamBusiness))
      : 0,
    selfBusiness: value ? Number(formatEther(value?.selfBusiness)) : 0,
  };

  return valueobject;
};

export const useUserRewardQualified = (address: string) => {
  const value = useCallHook('getUserRewardQualified', [address]);
  const valueFormatted = value ? value?.rewardId : '0';
  return valueFormatted;
};

export const useGetRewardStruct = (
  rewardId: string | undefined
): {
  id: number;
  selfBusinessLimit: number;
  directBusinessLimit: number;
  teamBusinessLimit: number;
  rankName: string;
  rewardName: string;
  appraisal: number;
} => {
  const value = useCallHook('rewards', [rewardId ?? 0]);
  const valueObject = {
    id: value ? value?.id : 0,
    selfBusinessLimit: value
      ? Number(formatEther(value?.selfBusinessLimit))
      : 0,
    directBusinessLimit: value
      ? Number(formatEther(value?.directBusinessLimit))
      : 0,
    teamBusinessLimit: value
      ? Number(formatEther(value?.teamBusinessLimit))
      : 0,
    rankName: value ? value?.rankName : 'ACM',
    rewardName: value ? value?.rewardName : '',
    appraisal: value ? Number(value?.appraisal) : 0,
  };
  return valueObject;
};

export const useGetUserTopUpForReward = (address: string) => {
  const value = useCallHook('getUserTopUpForRewards', [address])?.[0];
  const valueFormatted = value ? Number(formatEther(value)) : 0;
  return valueFormatted;
};
