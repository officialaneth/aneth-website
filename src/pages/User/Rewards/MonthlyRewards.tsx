import {
  Heading,
  HStack,
  Image,
  Progress,
  Tag,
  VStack,
  Wrap,
  Icon,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { FaUserFriends } from 'react-icons/fa';
import { ANUSDLogo } from '../../../constants';
import {
  useGetMonthlyUserAccount,
  useGetUserMonthlyBusiness,
} from '../../../hooks/MonthlyRewardsHooks';

export const MonthlyRewards = ({ address }: { address: string }) => {
  const userBusiness = useGetUserMonthlyBusiness(address);
  const userAccount = useGetMonthlyUserAccount(address);
  const targetSelfBusiness = 1000;
  const targetDirectBusiness = 10220;
  const targetTeamBusiness = 50000;
  const targetDirectTeamCount = 10;
  const targetAllTeamCount = 220;

  console.log(userBusiness);

  const businessData = [
    {
      heading: 'Self Business',
      target: targetSelfBusiness,
      value: userBusiness?.selfBusiness,
      valuePercentage: (userBusiness?.selfBusiness / targetSelfBusiness) * 100,
      logo: ANUSDLogo,
      logoType: 'Image',
    },
    {
      heading: 'DirectBusiness',
      target: targetDirectBusiness,
      value: userBusiness?.directBusiness,
      valuePercentage:
        (userBusiness?.directBusiness / targetDirectBusiness) * 100,
      logo: ANUSDLogo,
    },
    {
      heading: 'Direct Team Count',
      target: targetDirectTeamCount,
      value: userAccount?.referee?.length,
      valuePercentage:
        (userAccount?.referee?.length / targetDirectTeamCount) * 100,
      logo: FaUserFriends,
    },
    {
      heading: 'Team Business Main',
      target: targetTeamBusiness,
      value: userBusiness?.teamBusinessMain,
      valuePercentage:
        (userBusiness?.teamBusinessMain / targetTeamBusiness) * 100,
      logo: ANUSDLogo,
    },
    {
      heading: 'Team Business Other',
      target: targetTeamBusiness,
      value: userBusiness?.teamBusinessOther,
      valuePercentage:
        (userBusiness?.teamBusinessOther / targetTeamBusiness) * 100,
      logo: ANUSDLogo,
    },
    {
      heading: 'All Team Count',
      target: targetAllTeamCount,
      value: userAccount?.team?.length - userAccount?.referee?.length,
      valuePercentage:
        ((userAccount?.team?.length -
          userAccount?.referee?.length) / targetAllTeamCount) *
          100 ?? 0,
      logo: ANUSDLogo,
    },
  ];

  return (
    <VStack maxW={700} w="full">
      <Heading>Monthly Business</Heading>
      {businessData?.map((valueObject, key) => {
        return (
          <Wrap w="full" key={key}>
            <HStack>
              <Tag colorScheme="blue">{valueObject?.heading}</Tag>
              <Text fontWeight={900}>{valueObject?.value}</Text>
            </HStack>
            <HStack w="full">
              <Progress
                hasStripe
                value={valueObject?.valuePercentage}
                w="70%"
                h={7}
                borderRadius="full"
              />
              <Tag>{valueObject?.target}</Tag>
            </HStack>
          </Wrap>
        );
      })}
    </VStack>
  );
};
