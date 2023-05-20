import {
  Flex,
  Heading,
  Hide,
  HStack,
  Spacer,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import { Outlet } from 'react-router-dom';
import { NavUser } from '../../components';
import {
  useGetRewardStruct,
  useUserRewardQualified,
} from '../../hooks/ReferralHooks';

export const User = () => {
  const { account } = useEthers();
  const rewardIndex = useUserRewardQualified(account!);
  const rewardStruct = useGetRewardStruct(rewardIndex);

  return (
    <Flex w="full" px={5} gap={5} pt={100}>
      <Hide below="md">
        <NavUser />
      </Hide>
      <Flex
        flex={1}
        bgColor={useColorModeValue('gray.50', 'gray.900')}
        borderRadius="50px"
        py={10}
        px={5}
        w="full"
      >
        <VStack w="full">
          <HStack w="full">
            <Spacer />
            <HStack>
              <Heading size="sm">Rank</Heading>
              <Heading size="sm" color="pink.500">
                {rewardStruct?.rankName}
              </Heading>
            </HStack>
          </HStack>
          <Outlet></Outlet>
        </VStack>
      </Flex>
    </Flex>
  );
};
