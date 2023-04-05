import {
  Card,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { motion } from "framer-motion";
import {
  FaArrowDown,
  FaUserAstronaut,
  FaUserFriends,
  FaUsers,
} from "react-icons/fa";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { CardContainer } from "../../../components/UI";
import { UserRefereeCard } from "../../../components/UI/UserRefereeCard";

const MotionIcon = motion(Icon);
const MotionHeading = motion(Heading);
const MotionCard = motion(Card);

export const Team = () => {
  const { account, chainId } = useEthers();
  return (
    <VStack w="full" p={10} spacing={5}>
      <Wrap spacing={10} p={2} justify="center">
        <CardContainer>
          <Icon as={FaUserFriends} boxSize={10}></Icon>
          <Heading color="pink.500">5</Heading>
          <VStack spacing={0}>
            <Heading size="md">Direct</Heading>
            <Heading size="md">Referee</Heading>
          </VStack>
        </CardContainer>
        <CardContainer>
          <HStack spacing={10}>
            <Icon as={FaUserFriends} boxSize={10}></Icon>
            <Icon as={GiPayMoney} boxSize={10}></Icon>
          </HStack>
          <Heading color="pink.500">1000</Heading>
          <Heading size="sm" color="twitter.500">
            ANUSD
          </Heading>
          <VStack spacing={0}>
            <Heading size="md">Direct</Heading>
            <Heading size="md">Business</Heading>
          </VStack>
        </CardContainer>
        <CardContainer>
          <Icon as={FaUsers} boxSize={10}></Icon>
          <Heading color="pink.500">10</Heading>
          <VStack spacing={0}>
            <Heading size="md">Total</Heading>
            <Heading size="md">Team</Heading>
          </VStack>
        </CardContainer>
        <CardContainer>
          <HStack spacing={10}>
            <Icon as={FaUserFriends} boxSize={10}></Icon>
            <Icon as={GiReceiveMoney} boxSize={10}></Icon>
          </HStack>
          <Heading color="pink.500">10000</Heading>
          <Heading size="sm" color="twitter.500">
            ANUSD
          </Heading>
          <VStack spacing={0}>
            <Heading size="md">Team</Heading>
            <Heading size="md">Business</Heading>
          </VStack>
        </CardContainer>
      </Wrap>
      <CardContainer>
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
            <Heading size="md">Direct Referee</Heading>
            <Center p={5} borderWidth="thick" borderRadius="full">
              <MotionIcon
                as={FaUserAstronaut}
                boxSize={7}
                whileHover={{
                  scale: 1.5,
                }}
              ></MotionIcon>
            </Center>
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
      <CardContainer>
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
            <Heading size="md">Your Team</Heading>
            <Center p={5} borderWidth="thick" borderRadius="full">
              <MotionIcon
                as={FaUserAstronaut}
                boxSize={7}
                whileHover={{
                  scale: 1.5,
                }}
              ></MotionIcon>
            </Center>
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
    </VStack>
  );
};
