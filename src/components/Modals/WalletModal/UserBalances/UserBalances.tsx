import { VStack } from "@chakra-ui/react";
import { useEtherBalance, useEthers, useTokenBalance } from "@usedapp/core";
import { utils } from "ethers";
import React from "react";
import { useSupportedNetworkInfo } from "../../../../constants";
import { BalancesCard } from "../../../UI";

export const UserBalances = () => {
  const { chainId, account } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const userNativeBalanceWei = useEtherBalance(account);

  const userUSDTBalance = useTokenBalance(
    currentNetwork?.USDT?.ContractAddress,
    account
  );
  return (
    <VStack w="full">
      <BalancesCard
        currencyName={currentNetwork?.Native?.Symbol}
        currencyValue={utils.formatUnits(
          userNativeBalanceWei ?? 0,
          currentNetwork?.Native?.Decimals
        )}
        isLoaded={userNativeBalanceWei ? true : false}
        logo={currentNetwork?.Native?.Logo}
      ></BalancesCard>
      {/* <BalancesCard
        currencyName={currentNetwork?.USDT?.Symbol}
        currencyValue={utils.formatUnits(
          userUSDTBalance ?? 0,
          currentNetwork?.USDT?.Decimals
        )}
        isLoaded={userNativeBalanceWei ? true : false}
        logo={currentNetwork?.USDT?.Logo}
      ></BalancesCard> */}
    </VStack>
  );
};
