import {
  Button,
  Card,
  Heading,
  HStack,
  Icon,
  Input,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { BiCheckDouble } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { CardContainer } from "../../../../components/UI";
import { website } from "../../../../constants";

export const ReferralLink = ({ account }: { account: string }) => {
  const referralLink = `${website}/#/${account}`;

  const { onCopy, hasCopied } = useClipboard(referralLink);
  return (
    <CardContainer>
      <Icon as={FaUser} boxSize={10}></Icon>
      <Heading size="sm">Your referral link</Heading>
      {/* <Card p={3} borderRadius="xl">
        <Text w="full" maxW={[300, 400, 400, 500, 700]} textOverflow="ellipsis">
          {referralLink}
        </Text>
      </Card> */}
      <Input
        variant="filled"
        borderRadius="xl"
        minW={300}
        value={referralLink}
        color="pink.500"
        isReadOnly
      ></Input>
      <Button w="full" colorScheme="twitter" borderRadius="xl" onClick={onCopy}>
        {hasCopied ? (
          <HStack spacing={1}>
            <Text>Copied</Text>
            <Icon as={BiCheckDouble} boxSize={5}></Icon>
          </HStack>
        ) : (
          "Copy Referral Link"
        )}
      </Button>
    </CardContainer>
  );
};
