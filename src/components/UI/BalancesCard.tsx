import {
  Card,
  Divider,
  Heading,
  HStack,
  Icon,
  Image,
  Skeleton,
  Spacer,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";

const MotionCard = motion(Card);

export const BalancesCard = ({
  currencyName,
  currencyValue,
  logo,
  icon,
  isLoaded,
}: {
  currencyName: string;
  currencyValue: string;
  logo?: string;
  icon?: IconType;
  isLoaded: boolean;
}) => {
  return (
    <Skeleton borderRadius="50px" isLoaded={isLoaded} w="full">
      <MotionCard
        borderRadius="3xl"
        w="full"
        p={3}
        bgColor={useColorModeValue("gray.50", "whiteAlpha.200")}
        whileHover={{
          rotate: -10,
        }}
        whileTap={{
          rotate: -10,
        }}
      >
        <HStack justify="space-around" w="full">
          <VStack w="full">
            <HStack w="full">
              <Heading size="sm" color="pink.500" fontWeight="semibold">
                {currencyName}
              </Heading>
              {logo && (
                <>
                  <Spacer />
                  <Image src={logo} boxSize={7}></Image>
                </>
              )}
            </HStack>
            <Divider />
            <Heading size="sm" wordBreak="break-all" fontWeight={900}>
              {currencyValue}
            </Heading>
          </VStack>
        </HStack>
      </MotionCard>
    </Skeleton>
  );
};
