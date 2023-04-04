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
import { useEthers, useTokenBalance } from "@usedapp/core";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { useSupportedNetworkInfo } from "../../constants";

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
  const { account, chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const userTokenBalanceInWei = useTokenBalance(
    currentNetwork?.Token?.ContractAddress,
    account
  );
  return (
    <Skeleton
      borderRadius="50px"
      isLoaded={userTokenBalanceInWei ? true : false}
      w="full"
    >
      <MotionCard
        borderRadius="3xl"
        w="full"
        p={3}
        bgColor={useColorModeValue("gray.50", "whiteAlpha.200")}
        whileHover={{
          rotate: -10,
          scale: [1.05, 1.1, 1.05],
          // transition: {
          //   repeat: Infinity,
          //   type: "spring",
          //   stiffness: 700,
          // },
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
