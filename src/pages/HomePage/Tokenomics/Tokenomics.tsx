import {
  Center,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { MetaverseVRHero } from "../../../assets";
import { TokenomicsTSX } from "../../../assets/Tokenomics";

const MotionCenter = motion(Center);
const MotionImage = motion(Image);
const MotionWrap = motion(Wrap);

export const Tokenomics = () => {
  const tokenomicsText = [
    {
      value: "2.38",
      heading: "Initial Offer",
      text: "As like every startup, we are offering our some of the supply as Initial Offers. This is the best time to invest in any start up project.",
    },
    {
      value: "4.76",
      heading: "Community Development",
      text: "Various referral programs, contests, advertisement on social media, seminars, gatherings & many other activities to buildup community. As community is an integral part of any startup working for decentralization.",
    },
    {
      value: "4.76",
      heading: "Eco Syetem Development",
      text: "We have dedicated this supply to build, setup & develop the Eco System for decentralized world.",
    },
    {
      value: "4.76",
      heading: "Exchange Listings",
      text: "To increase the acceptability & usecase, this supply is dedicated for listing on various exchanges. As already discussion is going on some of the renowned exchanges.",
    },
    {
      value: "1.90",
      heading: "Rewards",
      text: "This supply is dedicated for rewards like staking.",
    },
    {
      value: "10",
      heading: "Metaverse Locked Supply",
      text: "This supply is locked untill we launch our virtual world. On launch of metaverse this supply will be unlocked and used as the payment gateways to virtial reality world.",
    },
    {
      value: "14.77",
      heading: "Web3 Infrastructure",
      text: "We are working on Web3 & decentralized network. This supply is dedicated to build the infrastructure to setup the decentralized network.",
    },
    {
      value: "5.23",
      heading: "Developer",
      text: "This supply is reserved for developers, core team members and the main pillars of our organization. Most of the supply is put into the vests.",
    },
    {
      value: "10",
      heading: "Future Expension",
      text: "As like all other organizations, we have setup and planned the things for future developments too. This supply is reserved for future development and will be used only after DAO votings.",
    },
    {
      value: "41.44",
      heading: "Public Offerings",
      text: "This supply will be used for public offerings on different exchanges, dexs and other mediums for providing liquidity.",
    },
  ];

  const [tokenomicsTextIndex, setTokenomicsTextIndex] = useState(0);
  const imageSize = [350, 400, 500];
  const headingSize = ["5xl", "6xl", "7xl"];
  return (
    <VStack minH={`${"100vh"}-${20}`} py={20} spacing={10}>
      <Heading>Tokenomics</Heading>
      <MotionWrap
        w="full"
        spacing={10}
        justify="center"
        align="center"
        overflow="hidden"
        animate={{}}
        transition={{
          type: "spring",
          stiffness: 700,
        }}
      >
        <Center boxSize={imageSize}>
          <Center
            boxSize={[250, 300]}
            zIndex={1111}
            position="absolute"
            borderRadius="full"
          >
            <VStack spacing={0}>
              <HStack>
                <Text
                  fontSize={headingSize}
                  fontWeight={900}
                  color="twitter.500"
                >
                  {tokenomicsText[tokenomicsTextIndex]?.value}
                </Text>
                <Heading size="md">%</Heading>
              </HStack>
            </VStack>
          </Center>
          <TokenomicsTSX
            onClickIO={() => setTokenomicsTextIndex(0)}
            onClickCommunity={() => setTokenomicsTextIndex(1)}
            onClickEcosystem={() => setTokenomicsTextIndex(2)}
            onClickExchangeListing={() => setTokenomicsTextIndex(3)}
            onClickRewards={() => setTokenomicsTextIndex(4)}
            onClickMetaverse={() => setTokenomicsTextIndex(5)}
            onClickWeb3={() => setTokenomicsTextIndex(6)}
            onClickDeveloper={() => setTokenomicsTextIndex(7)}
            onClickFuture={() => setTokenomicsTextIndex(8)}
            onClickPublic={() => setTokenomicsTextIndex(9)}
          />
        </Center>
        <VStack>
          <Heading textAlign="center" color="pink.500">
            {tokenomicsText[tokenomicsTextIndex]?.heading}
          </Heading>
          <Heading size="md" textAlign="center" maxW={500} w="95%">
            {tokenomicsText[tokenomicsTextIndex]?.text}
          </Heading>
        </VStack>
      </MotionWrap>
    </VStack>
  );
};
