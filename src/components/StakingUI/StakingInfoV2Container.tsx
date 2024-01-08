import {
  Button,
  Card,
  Divider,
  Heading,
  HStack,
  Spacer,
  VStack,
} from '@chakra-ui/react';
import { useContractFunction, useEthers } from '@usedapp/core';
import { useEffect } from 'react';
import { useSupportedNetworkInfo } from '../../constants';
import { useGetStakingReward, useStakeInfoMap } from '../../hooks/StakingHooks';
import { Counter } from '../Counter';
import { CardContainer } from '../UI';

export const StakingInfoV2Container = ({
  stakingID,
  tokenSymbol,
  anusdSymbol,
}: {
  stakingID: string;
  tokenSymbol: string;
  anusdSymbol: string;
}) => {
  const stakeInfoMap = useStakeInfoMap(stakingID, true);
  const getStakingRewardByID = useGetStakingReward(stakingID, true);
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];

  const { send, state, resetState, events } = useContractFunction(
    currentNetwork?.stakingV2ContractInterface,
    'claimStakingReward'
  );

  const handleTransaction = () => {
    send(stakingID);
  };

  useEffect(() => {
    if (state.status === 'Success') {
      resetState();
    }
  }, [state.status, resetState]);

  return (
    <CardContainer>
      <HStack w="full">
        <Heading size="sm">Mining ID</Heading>
        <Spacer></Spacer>
        <Heading size="sm" fontWeight={900} color="twitter.500">
          # {Number(stakingID) + 1000}
        </Heading>
      </HStack>
      <Divider></Divider>
      <VStack w="full">
        {/* <Heading size="sm">Locked Coins</Heading>
        <Card w="full" p={2} borderRadius="xl" align="center">
          {stakeInfoMap?.valueInToken} {tokenSymbol}
        </Card> */}
        <Heading size="sm">Mining Value</Heading>
        <Card w="full" p={2} borderRadius="xl" align="center">
          {stakeInfoMap?.valueInANUSD} {anusdSymbol}
        </Card>
      </VStack>
      <Divider></Divider>
      <VStack w="full">
        <Heading size="sm">Mining Duration</Heading>
        <Counter
          timeinseconds={stakeInfoMap?.startTime + stakeInfoMap?.duration}
          size="sm"
        ></Counter>
      </VStack>
      <Divider></Divider>
      <VStack w="full">
        <Heading size="sm">Coins Released</Heading>
        <Card
          w="full"
          p={2}
          borderRadius="xl"
          align="center"
          color="yellow.500"
        >
          {getStakingRewardByID} {anusdSymbol}
        </Card>
      </VStack>
      <Divider></Divider>
      <VStack w="full">
        <Heading size="sm">Coins Claimed</Heading>
        <Card w="full" p={2} borderRadius="xl" align="center" color="green.300">
          {stakeInfoMap?.rewardClaimedToken} {tokenSymbol}
        </Card>
        <Card w="full" p={2} borderRadius="xl" align="center" color="green.300">
          {stakeInfoMap?.rewardClaimedANUSD} {anusdSymbol}
        </Card>
        <Divider></Divider>
        <Button
          w="full"
          h={14}
          borderRadius="xl"
          colorScheme="twitter"
          onClick={handleTransaction}
          // isDisabled
        >
          Claim Reward
        </Button>
      </VStack>
    </CardContainer>
  );
};
