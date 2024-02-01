import { Flex, Heading, HStack, Text, VStack, Icon } from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { TbWorldWww } from 'react-icons/tb';

const SocialIconsLinks = ({
  icon,
  userName,
  link,
}: {
  icon: IconType;
  userName: string;
  link?: string;
}) => {
  return (
    <HStack as="a" href={link} target="_blank" cursor="pointer">
      <Icon as={icon} boxSize={8} color="twitter.500"></Icon>
      <Text>@{userName}</Text>
    </HStack>
  );
};

export const AboutUs = () => {
  return (
    <VStack>
      <Flex w="full" direction="column" maxW={1000} gap={10} px={5}>
        <Heading color="twitter.500">About Us:</Heading>
        <Heading size="md" fontWeight={500}>
          ANETH stands as an innovative decentralized protocol, poised to
          redefine the landscape of existing blockchains, Web3, Metaverse, and
          AI. The project is dedicated to revolutionizing the decentralized
          ecosystem by introducing a comprehensive suite of offerings. The
          ambitious roadmap includes the development of the ANETH Decentralized
          Exchange (DEX), ANETH Centralized Exchange (CEX), ANETH Staking, ANETH
          Decentralized Wallet, Layer 2 blockchain, ANETH Metaverse, alongside
          various other services and products.
        </Heading>
        <Heading size="md" fontWeight={500}>
          💠 ANETH, the native token of the project, is meticulously designed
          and operates seamlessly on the Polygon network, ensuring efficiency
          and scalability. With a total supply of 210 million, ANETH embodies a
          commitment to sustainability and controlled growth within the
          ecosystem.
        </Heading>
        <Heading size="md" fontWeight={500}>
          💵 Trading pairs ANETH/USDT and ANETH/BTC provide users with diverse
          options, catering to a broad range of investors and traders.
        </Heading>
        <Flex gap={5} direction="column">
          <Heading size="md" fontWeight={500}>
            ✅ Dive deeper into the ANETH project by exploring the following
            links:
          </Heading>
          <SocialIconsLinks
            icon={TbWorldWww}
            userName="www.aneth.io"
            link="https://aneth.io"
          ></SocialIconsLinks>
          <SocialIconsLinks
            icon={FaInstagram}
            userName="nethgroup_ofiicial"
            link="https://www.instagram.com/anethgroup_ofiicial"
          ></SocialIconsLinks>
          <SocialIconsLinks
            icon={FaTwitter}
            userName="AnethGroup"
            link="https://twitter.com/AnethGroup"
          ></SocialIconsLinks>
          <SocialIconsLinks
            icon={FaYoutube}
            userName="AnEthCoin83"
            link="https://www.youtube.com/@AnEthCoin83"
          ></SocialIconsLinks>
          <HStack></HStack>
        </Flex>
        <Heading size="md" fontWeight={500}>
          Join us on this transformative journey as we pave the way for the
          future of decentralized technologies. ANETH is not just a project;
          it's a vision realized.
        </Heading>
      </Flex>
    </VStack>
  );
};
