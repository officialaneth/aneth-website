import {
  Heading,
  HStack,
  Image,
  Progress,
  Tag,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import React from 'react';
import { ANUSDLogo } from '../../../constants';
import { useGetUserMonthlyBusiness } from '../../../hooks/MonthlyRewardsHooks';

export const MonthlyRewards = ({ address }: { address: string }) => {
  const userBusiness = useGetUserMonthlyBusiness(address);
  const targetSelfBusiness = 1000;
  const targetDirectBusiness = 10220;
  const targetTeamBusiness = 50000;

  const businessData = [
    {
      heading: 'Self Business',
      target: targetSelfBusiness,
      value: (userBusiness?.selfBusiness / targetSelfBusiness) * 100,
    },
    {
      heading: 'DirectBusiness',
      target: targetDirectBusiness,
      value: (userBusiness?.directBusiness / targetDirectBusiness) * 100,
    },
    {
      heading: 'Team Business Main',
      target: targetTeamBusiness,
      value: (userBusiness?.teamBusiness / targetTeamBusiness) * 100,
    },
    {
      heading: 'Team Business Other',
      target: targetTeamBusiness,
      value: (userBusiness?.teamBusiness / targetTeamBusiness) * 100,
    },
  ];

  return (
    <VStack maxW={700} w="full">
      <Heading>Monthly Business</Heading>
      {businessData?.map((valueObject, key) => {
        return (
          <Wrap w="full" key={key}>
            <Tag colorScheme="blue">{valueObject?.heading}</Tag>
            <HStack w="full">
              <Progress
                hasStripe
                value={valueObject?.value}
                w="70%"
                h={7}
                borderRadius="full"
              />
              <Tag>{valueObject?.target}</Tag>
              <Image src={ANUSDLogo} boxSize={5}></Image>
            </HStack>
          </Wrap>
        );
      })}
    </VStack>
  );
};
