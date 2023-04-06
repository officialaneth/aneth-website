import {
  Button,
  Heading,
  HStack,
  VStack,
  Icon,
  Text,
  Image,
  Wrap,
} from "@chakra-ui/react";
import { Counter } from "../../../components";
import { IoIosFlame } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  ANUSDLogo,
  DefaultChainId,
  PresaleEndsIn,
  TokenLogo,
  TokenName,
  useSupportedNetworkInfo,
} from "../../../constants";
import { CardContainer } from "../../../components/UI";
import { AiFillSchedule } from "react-icons/ai";
import { FcAreaChart } from "react-icons/fc";
import { useUniswapTokenOut } from "../../../hooks/UniswapV2Hooks";
import { useEthers } from "@usedapp/core";
import { ChevronRightIcon } from "@chakra-ui/icons";

export const PresaleStatus = () => {
  const currentNetwork = useSupportedNetworkInfo[DefaultChainId];
  const navigate = useNavigate();
  const tokenPrice = useUniswapTokenOut(
    1,
    currentNetwork?.Token?.ContractAddress,
    currentNetwork?.ANUSD?.ContractAddress,
    DefaultChainId
  );

  const secondsToDate = new Date(1000);
  console.log(secondsToDate);

  return (
    <VStack py={20} w="full" spacing={10} boxShadow="sm">
      <HStack>
        <Heading>Presale has started</Heading>
        <Icon as={FcAreaChart} boxSize={10} color="pink.400"></Icon>
      </HStack>
      <Counter timeinseconds={1688208584}></Counter>
      <Wrap spacing={5} justify="center" p={2}>
        <CardContainer>
          <Image src={TokenLogo} boxSize={10}></Image>
          <VStack spacing={0}>
            <Text>Name</Text>
            <Text fontSize="xl" fontWeight={900}>
              {TokenName}
            </Text>
          </VStack>
        </CardContainer>
        <CardContainer>
          <Icon as={IoIosFlame} boxSize={10} color="pink.400"></Icon>
          <VStack spacing={0}>
            <Text>Current Price</Text>
            <Text fontSize="xl" fontWeight={900}>
              {tokenPrice?.toFixed(3)} {currentNetwork?.ANUSD?.Symbol}
            </Text>
          </VStack>
        </CardContainer>
        <CardContainer>
          <Icon as={AiFillSchedule} boxSize={10}></Icon>

          <VStack spacing={0}>
            <Text>Presale Ends In</Text>
            <Text fontSize="xl" fontWeight={900}>
              {PresaleEndsIn}
            </Text>
          </VStack>
        </CardContainer>
        <CardContainer>
          <Image src={ANUSDLogo} boxSize={10}></Image>
          <VStack spacing={0}>
            <Text>Accepted Currency</Text>
            <Text fontSize="xl" fontWeight={900}>
              {currentNetwork?.ANUSD?.Symbol}
            </Text>
          </VStack>
        </CardContainer>
      </Wrap>
      <Button
        colorScheme="twitter"
        size="lg"
        onClick={() => navigate("swap")}
        w={300}
        h={20}
        borderRadius="3xl"
        rightIcon={<ChevronRightIcon />}
      >
        Participate in presale
      </Button>
    </VStack>
  );
};
