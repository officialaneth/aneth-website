import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  HStack,
  Icon,
  Image,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import { formatEther } from 'ethers/lib/utils';
import { SiTarget } from 'react-icons/si';
import { useParams } from 'react-router-dom';
import { ANUSDLogoSVG } from '../../../assets';
import {
  useGetRewardStruct,
  useGetUserTopUpForReward,
  useReferralUserAccount,
  useUserRewardQualified,
} from '../../../hooks/ReferralHooks';

export const Rewards = () => {
  const { account } = useEthers();
  const { userAddress } = useParams();
  const rewardIndex = useUserRewardQualified(userAddress ?? account!);
  const rewardStruct = useGetRewardStruct(rewardIndex);
  const nextRewardStruct = useGetRewardStruct(rewardIndex + 1);
  const accountMap = useReferralUserAccount(userAddress ?? account!);

  
  const userRewardTopUp = useGetUserTopUpForReward(account!);
  
  const topUpPercentrage =
    userRewardTopUp > 0
      ? (userRewardTopUp / nextRewardStruct?.selfBusinessLimit) * 100
      : 0;
  const directBusinessPercentage =
    accountMap?.directBusiness > 0
      ? (accountMap?.directBusiness / nextRewardStruct?.directBusinessLimit) *
        100
      : 0;

  const totalBusinessPercentage =
    accountMap?.totalBusiness > 0
      ? (accountMap?.totalBusiness / nextRewardStruct?.teamBusinessLimit) * 100
      : 0;
  return (
    <VStack w="full" py={50} spacing={10}>
      <VStack>
        <HStack>
          <Heading size="lg">You are</Heading>
          <Heading size="lg" color="twitter.500" fontWeight={900}>
            {rewardStruct?.rankName}
          </Heading>
        </HStack>
        <Divider />
      </VStack>
      <VStack spacing={5} align="flex-start">
        <HStack w="full" justify="center">
          <Heading size="lg">Next</Heading>
          <Heading size="lg" color="twitter.500">
            Target
          </Heading>
        </HStack>
        <HStack>
          <Tag size="sm" colorScheme="green">
            Top Up
          </Tag>
          <Slider
            value={topUpPercentrage}
            w={[100, 300, 400]}
            isDisabled={nextRewardStruct?.selfBusinessLimit === 0}
          >
            <SliderTrack h={5} borderRadius="xl">
              <SliderFilledTrack />
            </SliderTrack>
          </Slider>
          <Icon as={SiTarget}></Icon>
          <Tag>{nextRewardStruct?.selfBusinessLimit?.toFixed(0)}</Tag>
          <Image src={ANUSDLogoSVG} boxSize={5}></Image>
        </HStack>
        <HStack>
          <Tag size="sm" colorScheme="green">
            Direct Business
          </Tag>
          <Slider
            value={directBusinessPercentage}
            w={[100, 300, 400]}
            isDisabled={nextRewardStruct?.directBusinessLimit === 0}
          >
            <SliderTrack h={5} borderRadius="xl">
              <SliderFilledTrack />
            </SliderTrack>
          </Slider>
          <Icon as={SiTarget}></Icon>
          <Tag>{nextRewardStruct?.directBusinessLimit?.toFixed(0)}</Tag>
          <Image src={ANUSDLogoSVG} boxSize={5}></Image>
        </HStack>
        <HStack>
          <Tag size="sm" colorScheme="green">
            Team Business
          </Tag>
          <Slider
            value={totalBusinessPercentage * 2}
            w={[100, 300, 400]}
            isDisabled={nextRewardStruct?.teamBusinessLimit === 0}
          >
            <SliderTrack h={5} borderRadius="xl">
              <SliderFilledTrack />
            </SliderTrack>
          </Slider>
          <Icon as={SiTarget}></Icon>
          <Tag>{nextRewardStruct?.teamBusinessLimit?.toFixed(0)}</Tag>
          <Image src={ANUSDLogoSVG} boxSize={5}></Image>
        </HStack>
      </VStack>
      <VStack>
        <HStack>
          <Heading size="lg" textAlign="center">
            Next Achievement{' '}
            <Heading size="lg" color="twitter.500">
              Rewards
            </Heading>
          </Heading>
        </HStack>
        <Divider />
        <HStack>
          <Card borderRadius="3xl">
            <CardHeader>Rank</CardHeader>
            <CardBody>{nextRewardStruct?.rankName}</CardBody>
          </Card>
          <Card borderRadius="3xl">
            <CardHeader>Rewards</CardHeader>
            <CardBody>{nextRewardStruct?.rewardName}</CardBody>
          </Card>
          <Card borderRadius="3xl">
            <CardHeader>Appraisal</CardHeader>
            <CardBody>
              <HStack>
                <Text>{nextRewardStruct?.appraisal}</Text>
                <Image src={ANUSDLogoSVG} boxSize={5}></Image>
              </HStack>
            </CardBody>
          </Card>
        </HStack>
      </VStack>
      <VStack>
        <HStack>
          <Heading size="lg" textAlign="center">
            Current Achieved{' '}
            <Heading size="lg" color="twitter.500">
              Rewards
            </Heading>
          </Heading>
        </HStack>
        <Divider />
        <HStack>
          <Card borderRadius="3xl">
            <CardHeader>Rank</CardHeader>
            <CardBody>{rewardStruct?.rankName}</CardBody>
          </Card>
          <Card borderRadius="3xl">
            <CardHeader>Rewards</CardHeader>
            <CardBody>{rewardStruct?.rewardName}</CardBody>
          </Card>
          <Card borderRadius="3xl">
            <CardHeader>Appraisal</CardHeader>
            <CardBody>
              <HStack>
                <Text>{rewardStruct?.appraisal}</Text>
                <Image src={ANUSDLogoSVG} boxSize={5}></Image>
              </HStack>
            </CardBody>
          </Card>
        </HStack>
      </VStack>
    </VStack>
  );
};
