import {
  Button,
  Card,
  Divider,
  Heading,
  HStack,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { useGetStakingReward, useStakeInfoMap } from "../../hooks/StakingHooks";
import { Counter } from "../Counter";
import { CardContainer } from "../UI";

export const StakingInfoContainer = ({
  stakingID,
  tokenSymbol,
  anusdSymbol,
}: {
  stakingID: string;
  tokenSymbol: string;
  anusdSymbol: string;
}) => {
  const stakeInfoMap = useStakeInfoMap(stakingID);
  const getStakingRewardByID = useGetStakingReward(stakingID);
  return (
    <CardContainer>
      <HStack w="full">
        <Heading size="sm">Staking ID</Heading>
        <Spacer></Spacer>
        <Heading size="sm" fontWeight={900} color="twitter.500">
          # {stakingID}
        </Heading>
      </HStack>
      <Divider></Divider>
      <VStack w="full">
        <Heading size="sm">Value Staked</Heading>
        <Card w="full" p={2} borderRadius="xl" align="center">
          {stakeInfoMap?.value} {tokenSymbol}
        </Card>
      </VStack>
      <Divider></Divider>
      <VStack w="full">
        <Heading size="sm">Staking Ends In</Heading>
        <Counter
          timeinseconds={stakeInfoMap?.startTime + stakeInfoMap?.duration}
          size="sm"
        ></Counter>
      </VStack>
      <Divider></Divider>
      <VStack w="full">
        <Heading size="sm">Pending Reward</Heading>
        <Card
          w="full"
          p={2}
          borderRadius="xl"
          align="center"
          color="yellow.500"
        >
          {getStakingRewardByID} {tokenSymbol}
        </Card>
      </VStack>
      <Divider></Divider>
      <VStack w="full">
        <Heading size="sm">Reward Claimed</Heading>
        <Card w="full" p={2} borderRadius="xl" align="center" color="green.300">
          {stakeInfoMap?.rewardClaimed} {tokenSymbol}
        </Card>
        <Card w="full" p={2} borderRadius="xl" align="center" color="green.300">
          {stakeInfoMap?.rewardClaimedANUSD} {anusdSymbol}
        </Card>
        <Divider></Divider>
        <Button w="full" h={14} borderRadius="xl" colorScheme="twitter">
          Claim Reward
        </Button>
      </VStack>
    </CardContainer>
  );
};
