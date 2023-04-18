import { ChevronRightIcon } from "@chakra-ui/icons";
import { Button, Divider, Heading, Text, VStack, Wrap } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { useNavigate } from "react-router-dom";
import { BalancesCard, CardContainer } from "../../../components/UI";
import { TokenSymbol, useSupportedNetworkInfo } from "../../../constants";
import {
  useGetAllStakingRewards,
  useGetUserTotalRewardClaimedANUSD,
  useGetUserTotalStakedValue,
  useStakingUserAccountMap,
} from "../../../hooks/StakingHooks";
import { StakingIDCard } from "./StakingIDCard/StakingIDCard";

export const Staking = () => {
  const { account, chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const userAccountMapStaking = useStakingUserAccountMap(account!);
  const userTotalValueStaked = useGetUserTotalStakedValue(account!);
  const userTotalPendingRewards = useGetAllStakingRewards(account!);
  const userTotalRewardClaimed = useGetUserTotalRewardClaimedANUSD(account!);
  const navigate = useNavigate();
  return (
    <VStack w="full" spacing={10}>
      {userAccountMapStaking?.stakingIDs?.length > 0 ? (
        <VStack spacing={10}>
          <Heading>Mining Stats</Heading>
          <Wrap w="full" justify="center" spacing={10}>
            <CardContainer>
              <Heading size="sm">Total Minings</Heading>
              <BalancesCard
                currencyName={"No of mining"}
                // logo={currentNetwork?.Token?.Logo}
                currencyValue={userAccountMapStaking?.stakingIDs?.length.toString()}
              ></BalancesCard>
            </CardContainer>
            <CardContainer>
              <Heading size="sm">Value Locked</Heading>
              <BalancesCard
                currencyName={currentNetwork?.Token?.Symbol}
                logo={currentNetwork?.Token?.Logo}
                currencyValue={userTotalValueStaked?.token.toFixed(3)}
              ></BalancesCard>
            </CardContainer>
            <CardContainer>
              <Heading size="sm">Mining Bonus</Heading>
              <BalancesCard
                currencyName={currentNetwork?.Token?.Symbol}
                logo={currentNetwork?.Token?.Logo}
                currencyValue={userTotalValueStaked.anusd?.toFixed(3)}
              ></BalancesCard>
            </CardContainer>
            <CardContainer>
              <Heading size="sm">Coins Released</Heading>
              <BalancesCard
                currencyName={currentNetwork?.Token?.Symbol}
                logo={currentNetwork?.Token?.Logo}
                currencyValue={userTotalPendingRewards?.toFixed(5)}
              ></BalancesCard>
            </CardContainer>
            <CardContainer>
              <Heading size="sm">Coins Claimed</Heading>
              <BalancesCard
                currencyName={currentNetwork?.Token?.Symbol}
                logo={currentNetwork?.Token?.Logo}
                currencyValue={userTotalRewardClaimed?.toFixed(5)}
              ></BalancesCard>
            </CardContainer>
          </Wrap>
          <Divider />
          <Heading>Mining Details</Heading>
          <StakingIDCard
            tokenSymbol={currentNetwork?.Token?.Symbol}
            anusdSymbol={currentNetwork?.ANUSD?.Symbol}
            stakingIDs={userAccountMapStaking?.stakingIDs}
          ></StakingIDCard>
        </VStack>
      ) : (
        <VStack>
          <Heading color="red">You have no mining yet.</Heading>
          <Text>Please buy some {TokenSymbol} be miner.</Text>
          <Button
            onClick={() => navigate("/swap")}
            rightIcon={<ChevronRightIcon />}
            colorScheme="twitter"
          >
            Swap Now
          </Button>
        </VStack>
      )}
    </VStack>
  );
};
