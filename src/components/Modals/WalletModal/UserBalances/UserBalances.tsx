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

  const userANUSDBalance = useTokenBalance(
    currentNetwork?.ANUSD?.ContractAddress,
    account
  );

  const userTokenBalance = useTokenBalance(
    currentNetwork?.Token?.ContractAddress,
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
        logo={currentNetwork?.Native?.Logo}
      ></BalancesCard>
      <BalancesCard
        currencyName={currentNetwork?.ANUSD?.Symbol}
        currencyValue={utils.formatUnits(
          userANUSDBalance ?? 0,
          currentNetwork?.ANUSD?.Decimals
        )}
        logo={currentNetwork?.ANUSD?.Logo}
      ></BalancesCard>
      <BalancesCard
        currencyName={currentNetwork?.Token?.Symbol}
        currencyValue={utils.formatUnits(
          userTokenBalance ?? 0,
          currentNetwork?.Token?.Decimals
        )}
        logo={currentNetwork?.Token?.Logo}
      ></BalancesCard>
    </VStack>
  );
};
