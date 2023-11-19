import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Button,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { Polygon } from '@usedapp/core';
import { AiFillSchedule } from 'react-icons/ai';
import { FaFireAlt } from 'react-icons/fa';
import { FcAreaChart } from 'react-icons/fc';
import { IoIosFlame } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { Counter } from '../../../components';
import { CardContainer } from '../../../components/UI';
import {
  ANUSDLogo,
  DefaultChainId,
  PresaleEndsIn,
  TokenLogo,
  TokenName,
  useSupportedNetworkInfo,
} from '../../../constants';
import { useUniswapTokenOut } from '../../../hooks/UniswapV2Hooks';

export const Mission5Millions = () => {
  const currentNetwork = useSupportedNetworkInfo[Polygon?.chainId];
  const navigate = useNavigate();
  const tokenPrice = useUniswapTokenOut(
    1,
    currentNetwork?.Token?.ContractAddress,
    currentNetwork?.ANUSD?.ContractAddress,
    DefaultChainId
  );

  return (
    <VStack py={20} w="full" spacing={10} boxShadow="sm" px={5}>
      <Wrap justify="center" align="center">
        <Icon as={FaFireAlt} boxSize={200} color="pink.400"></Icon>
        <Heading fontSize={["6xl", "7xl", "8xl", "9xl"]} textAlign="center">Mission 5 Millions</Heading>
      </Wrap>
      <Heading textAlign="center" maxW={900}>We have successfully launched our project and ended presale. Now our target is to heading towards 5 Millions, community.</Heading>
      <Button
        colorScheme="twitter"
        size="lg"
        onClick={() => navigate('swap')}
        w={300}
        h={20}
        borderRadius="3xl"
        rightIcon={<ChevronRightIcon />}
      >
        Let's Swap Now
      </Button>
    </VStack>
  );
};
