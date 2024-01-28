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
  Wrap,
} from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import { SiTarget } from 'react-icons/si';
import { useParams } from 'react-router-dom';
import { ANUSDLogoSVG } from '../../../assets';
import { AddressZero } from '../../../constants';
import {
  useGetMonthlyRewardById,
  useGetMonthlyRewardsDefaults,
  useGetUserMonthlyBusiness,
  useGetUserRewardQualified,
} from '../../../hooks/MonthlyRewardsHooks';
import {
  useGetRewardStruct,
  useGetUserTopUpForReward,
  useReferralUserAccount,
  useUserRewardQualified,
  useUserTeamBusinessForRewards,
} from '../../../hooks/ReferralHooks';
import { MonthlyRewards } from './MonthlyRewards';

export const Rewards = () => {
  const { account } = useEthers();
  const { userAddress } = useParams();
  const rewardIndex = useUserRewardQualified(userAddress ?? account!);
  const rewardStruct = useGetRewardStruct(rewardIndex);
  const nextRewardStruct = useGetRewardStruct(rewardIndex + 1);
  const accountMap = useReferralUserAccount(userAddress ?? account!);

  // console.log("Next Reward Struct", nextRewardStruct)
  // console.log("Current Reward Struct", rewardIndex)

  const userBusinessForRewards = useUserTeamBusinessForRewards(
    userAddress ?? account!
  );

  console.log(userBusinessForRewards);

  const userRewardTopUp = useGetUserTopUpForReward(userAddress ?? account!);

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

  const userMonthlyRewardQualifiedNumber = useGetUserRewardQualified(
    userAddress ?? account!
  );

  const monthlyRewardObjectByID = useGetMonthlyRewardById(
    userMonthlyRewardQualifiedNumber
  );
  const nextMonthlyRewardObjectByID = useGetMonthlyRewardById(
    userMonthlyRewardQualifiedNumber + 1
  );

  const userTotalMonthlyBusiness = useGetUserMonthlyBusiness(
    userAddress ?? account!
  );

  const monthSelfBusinessPercentrage =
    userTotalMonthlyBusiness?.selfBusiness > 0
      ? (userTotalMonthlyBusiness?.selfBusiness /
          nextMonthlyRewardObjectByID?.selfBusinessLimit) *
        100
      : 0;

  const monthDirectPercentrage =
    userTotalMonthlyBusiness?.directBusiness > 0
      ? (userTotalMonthlyBusiness?.directBusiness /
          nextMonthlyRewardObjectByID?.directBusinessLimit) *
        100
      : 0;

  const monthTeamPercentrageMain =
    userBusinessForRewards?.mainBusiness > 0
      ? (userBusinessForRewards?.mainBusiness /
          nextMonthlyRewardObjectByID?.teamBusinessLimit) *
        100
      : 0;

  const monthTeamPercentrageOther =
    userBusinessForRewards?.otherBusiness > 0
      ? (userBusinessForRewards?.otherBusiness /
          nextMonthlyRewardObjectByID?.teamBusinessLimit) *
        100
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
        <Wrap>
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
        </Wrap>
        <Wrap>
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
        </Wrap>
        <Text>Team Business</Text>
        <Wrap>
          <Tag size="sm" colorScheme="green">
            Team Business Main
          </Tag>
          <Slider
            value={monthTeamPercentrageMain}
            w={[100, 300, 400]}
            isDisabled={nextRewardStruct?.teamBusinessLimit === 0}
          >
            <SliderTrack h={5} borderRadius="xl">
              <SliderFilledTrack />
            </SliderTrack>
          </Slider>
          <Icon as={SiTarget}></Icon>
          <Tag>{nextRewardStruct?.teamBusinessLimit?.toFixed(0)}</Tag>
          <Tag>{userBusinessForRewards?.mainBusiness}</Tag>
          <Image src={ANUSDLogoSVG} boxSize={5}></Image>
        </Wrap>
        <Wrap>
          <Tag size="sm" colorScheme="green">
            Team Business Others
          </Tag>
          <Slider
            value={monthTeamPercentrageOther}
            w={[100, 300, 400]}
            isDisabled={nextRewardStruct?.teamBusinessLimit === 0}
          >
            <SliderTrack h={5} borderRadius="xl">
              <SliderFilledTrack />
            </SliderTrack>
          </Slider>
          <Icon as={SiTarget}></Icon>
          <Tag>{nextRewardStruct?.teamBusinessLimit?.toFixed(0)}</Tag>
          <Tag>{userBusinessForRewards?.otherBusiness}</Tag>
          <Image src={ANUSDLogoSVG} boxSize={5}></Image>
        </Wrap>
      </VStack>
      {/* <MonthlyRewards
        address={userAddress ?? account ?? AddressZero}
      ></MonthlyRewards> */}
    </VStack>
  );
};
