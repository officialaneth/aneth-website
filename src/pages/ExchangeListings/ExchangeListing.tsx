import {
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  VStack,
  Wrap,
  Icon,
} from '@chakra-ui/react';
import React from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import { FiTarget } from 'react-icons/fi';

const ExchangeListings = ({
  imageSrc,
  pairLink,
}: {
  imageSrc: string;
  pairLink?: string;
}) => {
  return (
    <Center
      bgColor="white"
      boxSize={75}
      p={2}
      borderRadius="full"
      borderWidth="thick"
      as="a"
      href={pairLink}
      target="_blank"
    >
      <Image src={imageSrc}></Image>
    </Center>
  );
};

export const ExchangeListing = () => {
  return (
    <VStack>
      <Flex maxW={1000} direction="column" px={5} gap={10}>
        <Heading color="twitter.500">ANETH Exchange Listing:</Heading>
        <Heading size="md" fontWeight={500}>
          We are thrilled to announce that ANETH, the flagship token of our
          groundbreaking project, has achieved listing on several prominent
          exchanges, marking a significant milestone in our journey towards
          reshaping the decentralized landscape.
        </Heading>
        <Flex direction="column">
          <Heading>ANETH Token is listed on exchanges </Heading>
          <Icon as={FaExchangeAlt} color="twitter.500" boxSize={10}></Icon>
        </Flex>
        <Wrap spacing={5}>
          <ExchangeListings
            imageSrc="/exchangeLogos/vinDax.svg"
            pairLink="https://vindax.com/exchange-base.html?symbol=ANETH_USDT"
          ></ExchangeListings>
          <ExchangeListings
            imageSrc="/exchangeLogos/coinsBit.svg"
            pairLink="https://coinsbit.io/trade/ANETH_USDT"
          ></ExchangeListings>
          <ExchangeListings
            imageSrc="/exchangeLogos/azbit.svg"
            pairLink="https://azbit.com/exchange/ANETH_USDT"
          ></ExchangeListings>
          <ExchangeListings
            imageSrc="/exchangeLogos/quickSwap.svg"
            pairLink="https://quickswap.exchange/#/swap?swapIndex=1&currency0=0x89c701DCcC25e48566aF89cAC1e32706c5B55546&currency1=0xe6ffee89beb3bee2785eE88deD4Da74F8a082A78&isProMode=true"
          ></ExchangeListings>
        </Wrap>
        <Flex direction="column">
          <Heading>ANETH Token listing proposed exchanges</Heading>
          <HStack>
            <Icon as={FaExchangeAlt} color="twitter.500" boxSize={10}></Icon>
            <Icon as={FiTarget} color="red.500" boxSize={10}></Icon>
          </HStack>
        </Flex>
        <Heading>
          <Heading size="md" fontWeight={500}>
            Embark on this exciting journey with ANETH as we continue to expand
            our presence across renowned exchanges, fostering a vibrant and
            dynamic ecosystem for our users. Your support fuels our commitment
            to reimagining the future of decentralized technologies. Happy
            trading!
          </Heading>
        </Heading>
      </Flex>
    </VStack>
  );
};
