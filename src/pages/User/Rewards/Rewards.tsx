import {
  Divider,
  Heading,
  HStack,
  Progress,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderTrack,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetRewardStruct,
  useUserRewardQualified,
} from '../../../hooks/ReferralHooks';

export const Rewards = () => {
  const { account } = useEthers();
  const { userAddress } = useParams();
  const rewardIndex = useUserRewardQualified(userAddress ?? account!);
  const rewardStruct = useGetRewardStruct(rewardIndex);
  const nextRewardStruct = useGetRewardStruct(rewardIndex + 1);
  console.log(nextRewardStruct);
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
        <HStack>
          <Tag size="sm" colorScheme="green">
            Top Up
          </Tag>
          <Slider
            value={70}
            w={[100, 300, 400]}
            isDisabled={nextRewardStruct?.selfBusinessLimit === 0}
          >
            <SliderTrack h={5} borderRadius="xl">
              <SliderFilledTrack />
            </SliderTrack>
            <Tag colorScheme="yellow">
              <SliderMark value={100} p={2}>
                {nextRewardStruct?.selfBusinessLimit?.toFixed(2)}
              </SliderMark>
            </Tag>
          </Slider>
        </HStack>
        <HStack>
          <Tag size="sm" colorScheme="green">
            Direct Business
          </Tag>
          <Slider
            value={70}
            w={[100, 300, 400]}
            isDisabled={nextRewardStruct?.directBusinessLimit === 0}
          >
            <SliderTrack h={5} borderRadius="xl">
              <SliderFilledTrack />
            </SliderTrack>
            <Tag colorScheme="yellow">
              <SliderMark value={100} p={2}>
                {nextRewardStruct?.directBusinessLimit?.toFixed(2)}
              </SliderMark>
            </Tag>
          </Slider>
        </HStack>
        <HStack>
          <Tag size="sm" colorScheme="green">
            Team Business
          </Tag>
          <Slider
            value={70}
            w={[100, 300, 400]}
            isDisabled={nextRewardStruct?.teamBusinessLimit === 0}
          >
            <SliderTrack h={5} borderRadius="xl">
              <SliderFilledTrack />
            </SliderTrack>
            <Tag colorScheme="yellow">
              <SliderMark value={100} p={2}>
                {nextRewardStruct?.teamBusinessLimit?.toFixed(2)}
              </SliderMark>
            </Tag>
          </Slider>
        </HStack>
      </VStack>
    </VStack>
  );
};
