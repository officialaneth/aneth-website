import {
  Button,
  Card,
  Divider,
  Heading,
  HStack,
  Spacer,
  VStack,
} from "@chakra-ui/react";
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
          1000 {tokenSymbol}
        </Card>
      </VStack>
      <Divider></Divider>
      <VStack w="full">
        <Heading size="sm">Staking Ends In</Heading>
        <Counter timeinseconds={1712213509} size="sm"></Counter>
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
          0.00000111111 {tokenSymbol}
        </Card>
      </VStack>
      <Divider></Divider>
      <VStack w="full">
        <Heading size="sm">Reward Claimed</Heading>
        <Card w="full" p={2} borderRadius="xl" align="center" color="green.300">
          0.267776625 {tokenSymbol}
        </Card>
        <Card w="full" p={2} borderRadius="xl" align="center" color="green.300">
          0.267776625 {anusdSymbol}
        </Card>
        <Divider></Divider>
        <Button w="full" h={14} borderRadius="xl" colorScheme="twitter">
          Claim Reward
        </Button>
      </VStack>
    </CardContainer>
  );
};
