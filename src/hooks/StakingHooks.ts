import { useCall, useEthers } from "@usedapp/core";
import { useSupportedNetworkInfo } from "../constants";

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

export const useGetStakingReward = (stakingID: number) => {
  const value = useCallHook("getStakingReward", [stakingID]);
  return value;
};
