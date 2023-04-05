import { Box, Center, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { TokenomicsTSX } from "../../../assets/Tokenomics";

const MotionCenter = motion(Center);

export const Tokenomics = () => {
  const tokenomicsText = [
    {
      value: "2.38",
      heading: "Initial Offer",
      text: "This is the initial offer for public.",
    },
    {
      value: "4.76",
      heading: "Initial Offer",
      text: "This is the initial offer for public.",
    },
    {
      value: "4.76",
      heading: "Initial Offer",
      text: "This is the initial offer for public.",
    },
    {
      value: "4.76",
      heading: "Initial Offer",
      text: "This is the initial offer for public.",
    },
    {
      value: "1.90",
      heading: "Initial Offer",
      text: "This is the initial offer for public.",
    },
    {
      value: "10",
      heading: "Initial Offer",
      text: "This is the initial offer for public.",
    },
    {
      value: "14.77",
      heading: "Initial Offer",
      text: "This is the initial offer for public.",
    },
    {
      value: "5.23",
      heading: "Initial Offer",
      text: "This is the initial offer for public.",
    },
    {
      value: "10",
      heading: "Initial Offer",
      text: "This is the initial offer for public.",
    },
    {
      value: "41.44",
      heading: "Initial Offer",
      text: "This is the initial offer for public.",
    },
  ];

  const [tokenomicsTextIndex, setTokenomicsTextIndex] = useState(0);
  const imageSize = [350, 400, 500];
  const headingSize = ["5xl", "6xl", "7xl"];
  return (
    <VStack minH={`${"100vh"}-${20}`} py={20} spacing={10}>
      <Heading>Tokenomics</Heading>
      <Center boxSize={imageSize} overflow="hidden">
        <MotionCenter
          boxSize={[300, 500]}
          zIndex={1111}
          position="absolute"
          borderWidth="10px"
          borderRadius="full"
          borderStyle="dashed"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        ></MotionCenter>
        <Center boxSize={[250, 300]} zIndex={1111} position="absolute">
          <VStack>
            <HStack>
              <Text fontSize={headingSize} fontWeight={900} color="twitter.500">
                {tokenomicsText[tokenomicsTextIndex]?.value}
              </Text>
              <Heading size="md">%</Heading>
            </HStack>
            <Heading>{tokenomicsText[tokenomicsTextIndex]?.heading}</Heading>
            <Text maxW={250}>{tokenomicsText[tokenomicsTextIndex]?.text}</Text>
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
    </VStack>
  );
};
