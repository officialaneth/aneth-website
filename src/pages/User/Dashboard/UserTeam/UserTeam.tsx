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
import { motion } from "framer-motion";
import { BsEmojiSunglassesFill } from "react-icons/bs";
import { FaArrowDown, FaUserAstronaut } from "react-icons/fa";
import { CardContainer } from "../../../../components/UI";
import { UserRefereeCard } from "../../../../components/UI/UserRefereeCard";
import { useSupportedNetworkInfo } from "../../../../constants";
import { useReferralUserAccount } from "../../../../hooks/ReferralHooks";

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
  const userAccount = useReferralUserAccount(account);
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
        {userAccount?.referee?.length > 0 ? (
          <VStack w="full" spacing={3}>
            <Center borderWidth="thick" borderRadius="full">
              <Icon as={FaUserAstronaut} boxSize={7}></Icon>
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
                  {userAccount?.referee?.length}
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
                  {userAccount?.team?.length}
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
              {userAccount.referee.map((address: string, key: number) => {
                return (
                  <UserRefereeCard
                    address={address}
                    key={key}
                  ></UserRefereeCard>
                );
              })}
            </Wrap>
          </VStack>
        ) : (
          <VStack p={5}>
            <Icon as={BsEmojiSunglassesFill} boxSize={10}></Icon>
            <Heading size="sm" maxW={300} textAlign="center">
              * You have no team. Please share your referral link and earn the
              rewards.
            </Heading>
          </VStack>
        )}
      </MotionCard>
    </CardContainer>
  );
};
