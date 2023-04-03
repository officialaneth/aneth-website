import { VStack, Wrap } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import React from "react";
import { useSupportedNetworkInfo } from "../../../constants";
import { UserBalances } from "./UserBalances/UserBalances";
import { UserBusiness } from "./UserBusiness/UserBusiness";
import { UserIncome } from "./UserIncome/UserIncome";
import { UserStaking } from "./UserStaking/UserStaking";
import { UserTeam } from "./UserTeam/UserTeam";

export const Dashboard = () => {
  const { account, chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo;
  return (
    <VStack w="full" spacing={10}>
      <Wrap w="full" spacing={10} justify="center">
        <UserBalances
          account={account!}
          chainId={chainId!}
          currentNetwork={currentNetwork}
        ></UserBalances>
        <UserBusiness
          account={account!}
          chainId={chainId!}
          currentNetwork={currentNetwork}
        />
        <UserTeam
          account={account!}
          chainId={chainId!}
          currentNetwork={currentNetwork}
        />
      </Wrap>
      <Wrap w="full" spacing={10} justify="center">
        <UserIncome
          account={account!}
          chainId={chainId!}
          currentNetwork={currentNetwork}
        ></UserIncome>
        <UserStaking
          account={account!}
          chainId={chainId!}
          currentNetwork={currentNetwork}
        />
        {/* <UserTeam
          account={account!}
          chainId={chainId!}
          currentNetwork={currentNetwork}
        /> */}
      </Wrap>
    </VStack>
  );
};
