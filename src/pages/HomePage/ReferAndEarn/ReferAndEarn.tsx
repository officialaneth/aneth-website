import {
  Button,
  Heading,
  HStack,
  Input,
  Text,
  useClipboard,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import React from "react";
import { BiCheckDouble } from "react-icons/bi";
import { ConnectWalletButton } from "../../../components";
import { website } from "../../../constants";

export const ReferAndEarn = () => {
  const { account } = useEthers();
  const referralLink = `${website}/${account}`;

  const { onCopy, hasCopied } = useClipboard(referralLink);
  return (
    <VStack py={20} spacing={10} w="full" overflow="hidden">
      <Heading>Refer & Earn</Heading>
      <Heading color="pink.500" textAlign="center">
        Earn rewards upto 10%. Share your referral link now.
      </Heading>
      {account ? (
        <VStack>
          <Input
            variant="filled"
            borderRadius="xl"
            minW={300}
            value={referralLink}
            color="pink.500"
            isReadOnly
          ></Input>
          <Button
            w="full"
            colorScheme="twitter"
            borderRadius="xl"
            onClick={onCopy}
          >
            {hasCopied ? (
              <HStack spacing={1}>
                <Text>Copied</Text>
                <Icon as={BiCheckDouble} boxSize={5}></Icon>
              </HStack>
            ) : (
              "Copy Referral Link"
            )}
          </Button>
        </VStack>
      ) : (
        <VStack>
          <Heading size="sm" textAlign="center" color="red">
            * Please connect wallet to generate your referral link.
          </Heading>
          <ConnectWalletButton />
        </VStack>
      )}
    </VStack>
  );
};
