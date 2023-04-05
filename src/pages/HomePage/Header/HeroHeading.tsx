import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Center,
  HStack,
  Image,
  Text,
  VStack,
  Icon,
  Hide,
  Divider,
  Stack,
  Heading,
  Button,
  Highlight,
  Tag,
} from "@chakra-ui/react";
import React from "react";
import { VscVerifiedFilled } from "react-icons/vsc";
import { TypeAnimation } from "react-type-animation";
import { Logo } from "../../../components";
import { TokenLogo, TokenName } from "../../../constants";

export const HeroHeading = () => {
  const fontSize = ["4xl", "5xl"];
  return (
    <VStack align={["center", "center", "flex-start"]} spacing={5}>
      <HStack cursor="pointer">
        <Center h={7}>
          <Image src={TokenLogo} boxSize={[50, 75]} borderWidth="thick"></Image>
        </Center>
        <Text fontSize={["5xl", "6xl"]} fontWeight={900}>
          {TokenName} <Icon as={VscVerifiedFilled} color={"twitter.500"}></Icon>
        </Text>
      </HStack>
      <Stack direction={["column", "column", "row"]} spacing={[0, 2]}>
        <Text fontSize={fontSize} fontWeight={900}>
          Let's redefine
        </Text>
        <HStack spacing={0}>
          <Text fontSize={fontSize} fontWeight={900} color="twitter.500">
            #
          </Text>
          <Text fontSize={fontSize} fontWeight={900} color="pink.500">
            <TypeAnimation
              sequence={[
                "Ethereum",
                1000,
                "Blockchain",
                1000,
                "Web3",
                1000,
                "Metaverse",
                1000,
                "AI",
                1000,
              ]}
              repeat={Infinity}
            />
          </Text>
        </HStack>
      </Stack>
      <Heading
        maxW={700}
        opacity={0.75}
        textAlign={["center", "center", "left"]}
      >
        an.eth protocol is working for #<Text></Text>blockchain , #web3,
        #metaverse & #ai.
      </Heading>
      <HStack>
        <Button size="lg" colorScheme="twitter">
          Presale
        </Button>
        <Button size="lg" rightIcon={<ChevronRightIcon />} variant="ghost">
          Learn More
        </Button>
      </HStack>
    </VStack>
  );
};
