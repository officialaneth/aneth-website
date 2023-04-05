import {
  Heading,
  useColorModeValue,
  VStack,
  Icon,
  Card,
  Center,
  HStack,
  Text,
  Divider,
  Wrap,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import { FaArrowDown, FaUser, FaUserAstronaut } from "react-icons/fa";
import { CardContainer } from "../../../../components/UI";
import { UserCardTeam } from "../../../../components/UI/UserCardTeam";
import { UserRefereeCard } from "../../../../components/UI/UserRefereeCard";
import { useSupportedNetworkInfo } from "../../../../constants";

const MotionIcon = motion(Icon);
const MotionHeading = motion(Heading);
const MotionCard = motion(Card);

export const UserTeam = ({
  account,
  chainId,
  currentNetwork,
}: {
  account: string;
  chainId: number;
  currentNetwork: typeof useSupportedNetworkInfo;
}) => {
  return (
    <CardContainer>
      <Heading size="sm">Your Team</Heading>
      <MotionCard
        w="full"
        bgColor={useColorModeValue("gray.50", "whiteAlpha.200")}
        borderRadius="50px"
        p={3}
        whileHover={{
          borderRadius: "75px",
          scale: 0.99,
        }}
        whileTap={{
          borderRadius: "75px",
          scale: 0.99,
        }}
        transition={{
          type: "spring",
          stiffness: 700,
        }}
      >
        <VStack w="full" spacing={3}>
          <Center borderWidth="thick" borderRadius="full">
            <MotionIcon
              as={FaUserAstronaut}
              boxSize={7}
              whileHover={{
                scale: 1.5,
              }}
            ></MotionIcon>
          </Center>
          <HStack spacing={5}>
            <VStack>
              <MotionHeading
                size="md"
                fontWeight={900}
                color="pink.500"
                whileHover={{
                  scale: 1.5,
                }}
              >
                5
              </MotionHeading>
              <VStack spacing={0} fontSize="xs">
                <Text>Direct</Text>
                <Text>Referee</Text>
              </VStack>
            </VStack>
            <VStack>
              <MotionHeading
                size="md"
                fontWeight={900}
                color="pink.500"
                whileHover={{
                  scale: 1.5,
                }}
              >
                10
              </MotionHeading>
              <VStack spacing={0} fontSize="xs">
                <Text>Total</Text>
                <Text>Team</Text>
              </VStack>
            </VStack>
          </HStack>
          <Divider />
          <Icon as={FaArrowDown}></Icon>
          <Wrap w="full" align="center" justify="center" p={2}>
            <UserRefereeCard address={account}></UserRefereeCard>
            <UserRefereeCard address={account}></UserRefereeCard>
            <UserRefereeCard address={account}></UserRefereeCard>
            <UserRefereeCard address={account}></UserRefereeCard>
          </Wrap>
        </VStack>
      </MotionCard>
    </CardContainer>
  );
};
