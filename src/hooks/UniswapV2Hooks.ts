import { ChainId, useCall, useEthers } from "@usedapp/core";
import { BigNumber, utils } from "ethers";
import { DefaultChainId, useSupportedNetworkInfo } from "../constants";

const useCallHook = (methodName: string, arg: any[]) => {
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const { value, error } =
    useCall(
      currentNetwork?.uniswapV2RouterContract && {
        contract: currentNetwork?.uniswapV2RouterContractInterface,
        method: methodName,
        args: arg,
      }
    ) ?? {};

  if (error) {
    console.error("Uniswap Hooks", error.message);
    return undefined;
  }
  return value;
};

export const useUniswapTokenOut = (
  valueInDecimals: number,
  tokenInContract: string,
  tokenOutContract: string,
  chainId: number | undefined
) => {
  const currentNetwork = useSupportedNetworkInfo[chainId ?? DefaultChainId];
  const value: BigNumber[] | undefined = useCallHook("getAmountsOut", [
    utils.parseUnits(`${valueInDecimals}`, currentNetwork?.ANUSD?.Decimals),
    [tokenInContract, tokenOutContract],
  ])?.[0];

  const formatValue: number = value
    ? Number(utils.formatUnits(value[1], currentNetwork?.Token.Decimals))
    : 0;

  return formatValue;
};
