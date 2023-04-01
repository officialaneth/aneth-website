import { useCall, useEthers } from "@usedapp/core";
import { formatEther } from "ethers/lib/utils";
import { useSupportedNetworkInfo } from "../constants";

const useCallHook = (methodName: string, arg: any[]) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const { value, error } =
    useCall(
      currentNetwork?.presaleContract && {
        contract: currentNetwork?.presaleContractInterface,
        method: methodName,
        args: arg,
      }
    ) ?? {};

  if (error) {
    console.error("Presale Hooks", error.message);
    return undefined;
  }
  return value;
};

export const usePresaleCapping = () => {
  const value = useCallHook("getCapping", []);
  const valueObject = {
    minConUSD: value ? Number(formatEther(value?.minConUSD)) : 0,
    isBuyStakeEnabled: value ? value?.isBuyStakeEnabled : false,
    isPayReferralEnabled: value ? value?.isPayReferralEnabled : false,
    isPayRewardTokenEnabled: value ? value?.isPayRewardTokenEnabled : false,
  };

  return valueObject;
};
