import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Heading,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  useContractFunction,
  useEthers,
  useSendTransaction,
  useTokenBalance,
} from "@usedapp/core";
import { formatEther } from "ethers/lib/utils";
import React, { useState } from "react";
import { TbArrowsDoubleNeSw } from "react-icons/tb";
import { TokenLogo, useSupportedNetworkInfo } from "../../constants";
import { CardContainer } from "../UI";

export const TransferFundsUI = () => {
  const { account, chainId } = useEthers();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const [selectedToken, setSelectedToken] = useState(currentNetwork?.ANUSD);
  const userTokenBalance = useTokenBalance(
    selectedToken?.ContractAddress,
    account
  );

  const {
    send: sendToken,
    state: stateToken,
    resetState: resetStateToken,
  } = useContractFunction(selectedToken?.ContractInterface, "transfer");

  const {} = useSendTransaction();

  return (
    <CardContainer>
      <VStack
        w={300}
        bgColor={useColorModeValue("gray.50", "gray.900")}
        borderRadius="50px"
        p={5}
        spacing={5}
      >
        <Input
          h={20}
          borderRadius="3xl"
          placeholder="Please enter the sender address."
        ></Input>
        <VStack w="full">
          <HStack w="full">
            <Text>Balance:</Text>
            <Spacer />
            <Text>{Number(formatEther(userTokenBalance ?? 0)).toFixed(3)}</Text>
            <Button rightIcon={<ChevronDownIcon />} p={2} onClick={onOpen}>
              <Image src={selectedToken?.Logo} boxSize={7}></Image>
            </Button>
          </HStack>
          <Input
            h={20}
            borderRadius="3xl"
            placeholder="Please enter the value."
          ></Input>
        </VStack>

        <Button
          w="full"
          h={20}
          colorScheme="twitter"
          borderRadius="3xl"
          rightIcon={<TbArrowsDoubleNeSw />}
        >
          Transfer
        </Button>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="50px">
          <ModalCloseButton />
          <ModalHeader>Please select the coin to transfer</ModalHeader>
          <ModalBody>
            <VStack p={5} spacing={5}>
              <HStack
                w="full"
                bgColor={useColorModeValue("gray.50", "gray.900")}
                p={5}
                borderRadius="3xl"
                cursor="pointer"
                onClick={() => {
                  setSelectedToken(currentNetwork?.Token);
                  onClose();
                }}
              >
                <Heading size="md">{currentNetwork?.Token?.Symbol}</Heading>
                <Spacer />
                <Image src={currentNetwork?.Token?.Logo} boxSize={10}></Image>
              </HStack>
              <HStack
                w="full"
                bgColor={useColorModeValue("gray.50", "gray.900")}
                p={5}
                borderRadius="3xl"
                cursor="pointer"
                onClick={() => {
                  setSelectedToken(currentNetwork?.ANUSD);
                  onClose();
                }}
              >
                <Heading size="md">{currentNetwork?.ANUSD?.Symbol}</Heading>
                <Spacer />
                <Image src={currentNetwork?.ANUSD?.Logo} boxSize={10}></Image>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </CardContainer>
  );
};
