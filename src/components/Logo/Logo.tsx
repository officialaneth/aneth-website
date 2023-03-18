import { Center, Heading, HStack, Icon, Image } from "@chakra-ui/react";
import { VscVerifiedFilled } from "react-icons/vsc";
import { TokenLogo, TokenName } from "../../constants";

export const Logo = () => {
  return (
    <HStack>
      <Center h={7}>
        <Image src={TokenLogo} boxSize={34} borderWidth="thick"></Image>
      </Center>
      <Heading size="md" fontWeight={900}>
        {TokenName} <Icon as={VscVerifiedFilled} color={"twitter.500"}></Icon>
      </Heading>
    </HStack>
  );
};
