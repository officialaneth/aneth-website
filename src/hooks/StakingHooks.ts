import { useCall, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { AddressZero, useSupportedNetworkInfo } from '../constants';

const useCallHook = (methodName: string, arg: any[], isV2?: boolean) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const { value, error } =
    useCall(
      (isV2
        ? currentNetwork?.stakingV2ContractAddress
        : currentNetwork?.stakingContractAddress) && {
        contract: isV2
          ? currentNetwork?.stakingV2ContractInterface
          : currentNetwork?.stakingContractInterface,
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

export const useStakingUserAccountMap = (
  account: string,
  isV2?: boolean
): {
  isDisabled: boolean;
  stakingIDs: BigNumber[] | [];
  blockNumbers: BigNumber[] | [];
} => {
  const value = useCallHook('userAccountMap', [account], isV2);
  const valueObject = {
    isDisabled: value ? value?.[0]?.isDisabled : false,
    stakingIDs: value ? value?.[0]?.stakingID : [],
    blockNumbers: value ? value?.[0]?.blockNumber : [],
  };
  return valueObject;
};

export const useStakeInfoMap = (
  stakingID: string,
  isV2?: boolean
): {
  isStaked: boolean;
  owner: string;
  valueInToken: number;
  valueInANUSD: number;
  rewardRate: number;
  startTime: number;
  duration: number;
  rewardClaimedToken: number;
  rewardClaimedANUSD: number;
  principalClaimed: number;
  lastTimeRewardClaimed: number;
} => {
  const value = useCallHook('stakeInfoMap', [stakingID], isV2);
  const valueObject = {
    isStaked: value ? value?.[0]?.isStaked : false,
    owner: value ? value?.[0]?.owner : AddressZero,
    valueInToken: value ? Number(formatEther(value?.[0].valueInToken)) : 0,
    valueInANUSD: value ? Number(formatEther(value?.[0].valueInANUSD)) : 0,
    rewardRate: value ? Number(value?.[0].rewardRate.toString()) : 0,
    startTime: value ? Number(value?.[0].startTime.toString()) : 0,
    duration: value ? Number(value?.[0].duration?.toString()) : 0,
    rewardClaimedToken: value
      ? Number(formatEther(value?.[0].rewardClaimedToken))
      : 0,
    rewardClaimedANUSD: value
      ? Number(formatEther(value?.[0].rewardClaimedANUSD))
      : 0,

    principalClaimed: value
      ? Number(formatEther(value?.[0].principalClaimed))
      : 0,
    lastTimeRewardClaimed: value
      ? Number(value?.[0].lastTimeRewardClaimed.toString())
      : 0,
  };
  return valueObject;
};

export const useGetStakingReward = (
  stakingID: string | number,
  isV2?: boolean
) => {
  const value = useCallHook('getStakingReward', [stakingID], isV2);
  const valueFormatted = value ? Number(formatEther(value?.[0])) : 0;
  return valueFormatted;
};

export const useGetAllStakingRewards = (address: string, isV2?: boolean) => {
  const value = useCallHook('getUserAllStakingsRewards', [address], isV2);
  const valueFormatted = value ? Number(formatEther(value?.[0])) : 0;
  return valueFormatted;
};

export const useGetUserTotalStakedValue = (address: string, isV2?: boolean) => {
  const value = useCallHook('getUserTotalValueStaked', [address], isV2);

  const valueObject = {
    token: value ? Number(formatEther(value?.token)) : 0,
    anusd: value ? Number(formatEther(value?.anusd)) : 0,
  };

  return valueObject;
};

export const useGetUserTotalRewardClaimedANUSD = (
  address: string,
  isV2?: boolean
) => {
  const value = useCallHook('getUserTotalRewardClaimedANUSD', [address], isV2);
  const valueFormatted = value ? Number(formatEther(value?.[0])) : 0;
  return valueFormatted;
};

export const useGetUserTotalRewardClaimedToken = (
  address: string,
  isV2?: boolean
) => {
  const value = useCallHook('getUserTotalRewardClaimedToken', [address], isV2);
  const valueFormatted = value ? Number(formatEther(value?.[0])) : 0;
  return valueFormatted;
};

export const useGetUserTotalPrincipalClaimed = (
  address: string,
  isV2?: boolean
) => {
  const value = useCallHook('getUserTotalPrincipalClaimed', [address], isV2);
  const valueFormatted = value ? Number(formatEther(value?.[0])) : 0;
  return valueFormatted;
};
