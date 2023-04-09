import {
  Card,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  useColorModeValue,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { motion } from "framer-motion";
import { AiTwotoneShop } from "react-icons/ai";
import { BsEmojiSunglassesFill } from "react-icons/bs";
import {
  FaArrowDown,
  FaCartArrowDown,
  FaUserAstronaut,
  FaUserFriends,
  FaUsers,
} from "react-icons/fa";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { CardContainer } from "../../../components/UI";
import { UserRefereeCard } from "../../../components/UI/UserRefereeCard";
import {
  useReferralUserAccount,
  useUserTotalBusiness,
} from "../../../hooks/ReferralHooks";

const MotionIcon = motion(Icon);
const MotionCard = motion(Card);

export const Team = () => {
  const { account, chainId } = useEthers();
  const userAccount = useReferralUserAccount(account!);
  const userTotalBusiness = useUserTotalBusiness(account!);
  return (
    <VStack w="full" p={10} spacing={5}>
      <Wrap spacing={10} p={2} justify="center">
        <CardContainer>
          <Icon as={FaUserFriends} boxSize={10}></Icon>
          <Heading color="pink.500">{userAccount?.referee?.length}</Heading>
          <VStack spacing={0}>
            {/* <Heading size="md">Direct</Heading> */}
            <Heading size="md">Referee</Heading>
          </VStack>
        </CardContainer>

        <CardContainer>
          <Icon as={FaUsers} boxSize={10}></Icon>
          <Heading color="pink.500">{userAccount?.team?.length}</Heading>
          <VStack spacing={0}>
            {/* <Heading size="md">Total</Heading> */}
            <Heading size="md">Team</Heading>
          </VStack>
        </CardContainer>
      </Wrap>
      <Wrap spacing={10} p={2} justify="center">
        <CardContainer>
          <HStack spacing={10}>
            <Icon as={FaCartArrowDown} boxSize={10}></Icon>
          </HStack>
          <Heading color="pink.500">
            {userAccount?.selfBusiness?.toFixed(3)}
          </Heading>
          <Heading size="sm" color="twitter.500">
            ANUSD
          </Heading>
          <VStack spacing={0}>
            <Heading size="md">Self</Heading>
            <Heading size="md">Business</Heading>
          </VStack>
        </CardContainer>
        <CardContainer>
          <HStack spacing={10}>
            <Icon as={FaUserFriends} boxSize={10}></Icon>
            <Icon as={GiPayMoney} boxSize={10}></Icon>
          </HStack>
          <Heading color="pink.500">
            {userTotalBusiness?.directBusiness}
          </Heading>
          <Heading size="sm" color="twitter.500">
            ANUSD
          </Heading>
          <VStack spacing={0}>
            <Heading size="md">Direct</Heading>
            <Heading size="md">Business</Heading>
          </VStack>
        </CardContainer>
        <CardContainer>
          <Icon as={AiTwotoneShop} boxSize={10}></Icon>
          <Heading color="pink.500">{userTotalBusiness?.totalBusiness}</Heading>
          <Heading size="sm" color="twitter.500">
            ANUSD
          </Heading>
          <VStack spacing={0}>
            <Heading size="md">Total</Heading>
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
              {userAccount?.referee.length > 0 ? (
                userAccount.referee.map((address: string, key: number) => {
                  return <UserRefereeCard address={address}></UserRefereeCard>;
                })
              ) : (
                <VStack p={5}>
                  <Icon as={BsEmojiSunglassesFill} boxSize={10}></Icon>
                  <Heading size="sm" maxW={300} textAlign="center">
                    * You have no team. Please share your referral link and earn
                    the rewards.
                  </Heading>
                </VStack>
              )}
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
              {userAccount?.team.length > 0 ? (
                userAccount.team.map((address: string, key: number) => {
                  return <UserRefereeCard address={address}></UserRefereeCard>;
                })
              ) : (
                <VStack p={5}>
                  <Icon as={BsEmojiSunglassesFill} boxSize={10}></Icon>
                  <Heading size="sm" maxW={300} textAlign="center">
                    * You have no team. Please share your referral link and earn
                    the rewards.
                  </Heading>
                </VStack>
              )}
            </Wrap>
          </VStack>
        </MotionCard>
      </CardContainer>
    </VStack>
  );
};
