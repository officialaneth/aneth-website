import {
  Image,
  Spacer,
  Stack,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { HeroHeading } from "./HeroHeading";
import { HeroImage } from "./HeroImage";

export const Header = () => {
  return (
    <VStack
      w="full"
      py="100px"
      px={5}
      userSelect="none"
      bgGradient={useColorModeValue(
        "linear(to-r, white, gray.200)",
        "linear(to-l, blackAlpha.700, gray.900)"
      )}
    >
      <Stack
        w="full"
        maxW={1300}
        direction={["column-reverse", "column-reverse", "row"]}
        justify="space-between"
        align="center"
      >
        <HeroHeading />
        <HeroImage />
      </Stack>
    </VStack>
  );
};
