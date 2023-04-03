import { Flex, VStack } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { ReactNode } from "react";
import { useSupportedNetworkInfo } from "../constants";
import { NoAuth, UnsupportedNetwork } from "../pages/Error";

export const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  const { account, chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  return (
    <Flex flex={1}>
      {account ? (
        !currentNetwork ? (
          <UnsupportedNetwork></UnsupportedNetwork>
        ) : (
          children
        )
      ) : (
        <NoAuth></NoAuth>
      )}
    </Flex>
  );
};
