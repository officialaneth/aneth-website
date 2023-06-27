import { useCall, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { AddressZero, useSupportedNetworkInfo } from '../constants';

const useCallHook = (methodName: string, arg: any[]) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const { value, error } =
    useCall(
      currentNetwork?.monthlyRewardsContractAddress && {
        contract: currentNetwork?.monthlyRewardsContractInterface,
        method: methodName,
        args: arg,
      }
    ) ?? {};

  if (error) {
    console.error('Monthly Rewards Hooks', error.message);
    return undefined;
  }
  return value;
};

export const useGetUserMonthlyBusiness = (userAddress: string) => {
  const value = useCallHook('getUserBusiness', [userAddress]);
  const valueObject = {
    directBusiness: value ? Number(formatEther(value?._directBusiness)) : 0,
    selfBusiness: value ? Number(formatEther(value?._selfBusiness)) : 0,
    teamBusiness: value ? Number(formatEther(value?._teamBusiness)) : 0,
  };
  return valueObject;
};

export const useGetMonthlyRewardById = (
  monthlyRewardId: number | undefined
) => {
  const value = useCallHook('getRewardsByID', [monthlyRewardId])?.[0];
  const valueObject = {
    selfBusinessLimit: value
      ? Number(formatEther(value?.selfBusinessLimit))
      : 0,
    directBusinessLimit: value
      ? Number(formatEther(value?.directBusinessLimit))
      : 0,
    teamBusinessLimit: value
      ? Number(formatEther(value?.teamBusinessLimit))
      : 0,
    id: value ? Number(value?.id) : 0,
    rewardName: value ? value?.rewardName : '',
  };
  return valueObject;
};

export const useGetUserRewardQualified = (userAddress: string) => {
  const value = useCallHook('getUserRewardQualified', [userAddress])?.[0];
  return value ? Number(value) : 0;
};
