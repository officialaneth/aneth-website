import { Heading, Image, useColorModeValue, VStack } from "@chakra-ui/react";
import { RoadmapPNG } from "../../../assets";

export const Roadmap = () => {
  return (
    <VStack
      minH={`${"100vh"}-${20}`}
      py={20}
      spacing={10}
      w="full"
      overflow="hidden"
      // bgImage={StarBG}
      bgColor={useColorModeValue("gray.100", "black")}
    >
      <Heading>Roadmap</Heading>
      <Image src={RoadmapPNG} w="70%" minW={900}></Image>
    </VStack>
  );
};
