import { Center, Heading, HStack, Icon, Image } from "@chakra-ui/react";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { TokenLogo, TokenName } from "../../constants";

export const Logo = () => {
  const navigate = useNavigate();
  return (
    <HStack onClick={() => navigate("/")} cursor="pointer">
      <Center h={7}>
        <Image src={TokenLogo} boxSize={34} borderWidth="thick"></Image>
      </Center>
      <Heading size="md" fontWeight={900}>
        {TokenName} <Icon as={VscVerifiedFilled} color={"twitter.500"}></Icon>
      </Heading>
    </HStack>
  );
};
