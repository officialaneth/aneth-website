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
import { SiTarget } from 'react-icons/si';
import { useParams } from 'react-router-dom';
import { ANUSDLogoSVG } from '../../../assets';
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
} from '../../../hooks/ReferralHooks';

export const Rewards = () => {
  const { account } = useEthers();
  const { userAddress } = useParams();
  const rewardIndex = useUserRewardQualified(userAddress ?? account!);
  const rewardStruct = useGetRewardStruct(rewardIndex);
  const nextRewardStruct = useGetRewardStruct(rewardIndex + 1);
  const accountMap = useReferralUserAccount(userAddress ?? account!);

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

  const monthTeamPercentrage =
    userTotalMonthlyBusiness?.teamBusiness > 0
      ? (userTotalMonthlyBusiness?.teamBusiness /
          nextMonthlyRewardObjectByID?.teamBusinessLimit) *
        100
      : 0;

  const monthlyDefault = useGetMonthlyRewardsDefaults();

  console.log(monthlyDefault);
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
      <Divider></Divider>

      <Tag size="lg" borderRadius="xl" colorScheme="green">
        <Heading>Monthly Rewards</Heading>
      </Tag>
      <VStack>
        <HStack>
          <Heading size="lg">
            {userMonthlyRewardQualifiedNumber > 0
              ? 'You have achieved'
              : 'You have not achieved any reward yet.'}
          </Heading>
          <Heading size="lg" color="twitter.500" fontWeight={900}>
            {monthlyRewardObjectByID?.rewardName}
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
            Self Business
          </Tag>
          <Slider
            value={monthSelfBusinessPercentrage}
            w={[100, 300, 400]}
            isDisabled={nextMonthlyRewardObjectByID?.selfBusinessLimit === 0}
          >
            <SliderTrack h={5} borderRadius="xl">
              <SliderFilledTrack />
            </SliderTrack>
          </Slider>
          <Icon as={SiTarget}></Icon>
          <Tag>
            {nextMonthlyRewardObjectByID?.selfBusinessLimit?.toFixed(0)}
          </Tag>
          <Image src={ANUSDLogoSVG} boxSize={5}></Image>
        </HStack>
        <Heading size="sm">
          Self Business: {userTotalMonthlyBusiness?.selfBusiness} ANUSD
        </Heading>
        <HStack>
          <Tag size="sm" colorScheme="green">
            Direct Business
          </Tag>
          <Slider value={monthDirectPercentrage} w={[100, 300, 400]}>
            <SliderTrack h={5} borderRadius="xl">
              <SliderFilledTrack />
            </SliderTrack>
          </Slider>
          <Icon as={SiTarget}></Icon>
          <Tag>
            {nextMonthlyRewardObjectByID?.directBusinessLimit?.toFixed(0)}
          </Tag>
          <Image src={ANUSDLogoSVG} boxSize={5}></Image>
        </HStack>
        <Heading size="sm">
          Direct Business: {userTotalMonthlyBusiness?.directBusiness} ANUSD
        </Heading>
        <HStack>
          <Tag size="sm" colorScheme="green">
            Team Business
          </Tag>
          <Slider
            value={monthTeamPercentrage}
            w={[100, 300, 400]}
            isDisabled={nextRewardStruct?.teamBusinessLimit === 0}
          >
            <SliderTrack h={5} borderRadius="xl">
              <SliderFilledTrack />
            </SliderTrack>
          </Slider>
          <Icon as={SiTarget}></Icon>
          <Tag>
            {Number(
              nextMonthlyRewardObjectByID?.teamBusinessLimit * 2
            )?.toFixed(0)}
          </Tag>
          <Image src={ANUSDLogoSVG} boxSize={5}></Image>
        </HStack>
        <Heading size="sm">
          Team Business: {userTotalMonthlyBusiness?.teamBusiness} ANUSD
        </Heading>
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
        <Heading>{nextMonthlyRewardObjectByID?.rewardName}</Heading>
      </VStack>
      {/* <VStack>
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
      </VStack> */}
    </VStack>
  );
};
