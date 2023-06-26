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

// export const useGetRewardsById = (rewardId: number) => {
//     const value = 
// }
