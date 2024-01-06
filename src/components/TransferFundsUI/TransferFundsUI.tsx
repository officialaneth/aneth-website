import { ChevronDownIcon, CloseIcon } from '@chakra-ui/icons';
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
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  useContractFunction,
  useEtherBalance,
  useEthers,
  useSendTransaction,
  useTokenBalance,
} from '@usedapp/core';
import { formatEther, formatUnits, parseEther } from 'ethers/lib/utils';
import React, { useState } from 'react';
import { TbArrowsDoubleNeSw } from 'react-icons/tb';
import { TokenLogo, useSupportedNetworkInfo } from '../../constants';
import { CardContainer } from '../UI';

export const TransferFundsUI = () => {
  const toast = useToast();
  const { account, chainId } = useEthers();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const [selectedCoin, setSelectedCoin] = useState(currentNetwork?.ANUSD);
  const userTokenBalance = useTokenBalance(
    selectedCoin?.ContractAddress,
    account
  );

  const userNativeBalance = useEtherBalance(account);

  const [userInput, setUserInput] = useState({
    senderAddressInput: '',
    valueInput: '',
  });

  const selectedCoinBalance = () => {
    // @ts-ignore
    if (selectedCoin === currentNetwork?.Native) {
      return userNativeBalance;
    } else {
      return userTokenBalance;
    }
  };

  const handleUserInput = (e: any) => {
    setUserInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTransfer = () => {
    if (
      Number(userInput?.valueInput) >
      Number(formatEther(selectedCoinBalance() ?? 0))
    ) {
      toast({
        title: 'Error: Value greater then your balance.',
        description: 'Please enter value less than your balance.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else if (userInput.valueInput.length === 0) {
      toast({
        title: 'Error: Value Empty.',
        description: 'Please enter the value to send.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else if (userInput.senderAddressInput.length === 0) {
      toast({
        title: 'Error: No address selected.',
        description: 'Please enter the address to send value.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      proceedSwap();
    }
  };

  const proceedSwap = async () => {
    // @ts-ignore
    if (selectedCoin === currentNetwork?.Native) {
      sendTransaction({
        to: userInput?.senderAddressInput,
        value: parseEther(userInput?.valueInput),
      });
    } else {
      sendToken(
        userInput.senderAddressInput,
        parseEther(userInput.valueInput),
        {
          value: 0,
        }
      );
    }
  };

  const {
    send: sendToken,
    state: stateToken,
    resetState: resetStateToken,
  } = useContractFunction(selectedCoin?.ContractInterface, 'transfer');

  const {
    sendTransaction,
    state: stateNative,
    resetState: resetNative,
  } = useSendTransaction();

  return (
    <CardContainer>
      <VStack
        w={300}
        bgColor={useColorModeValue('gray.50', 'gray.900')}
        borderRadius="50px"
        p={5}
        spacing={5}
      >
        <Input
          h={20}
          borderRadius="3xl"
          placeholder="Please enter the sender address."
          value={userInput.senderAddressInput}
          onChange={handleUserInput}
          name="senderAddressInput"
        ></Input>
        <VStack w="full">
          <HStack w="full">
            <Text>Balance:</Text>
            <Spacer />
            <Text>
              {/* @ts-ignore */}
              {selectedCoin === currentNetwork?.Native
                ? Number(formatEther(userNativeBalance ?? 0)).toFixed(3)
                : Number(formatUnits(userTokenBalance ?? 0, selectedCoin?.Decimals)).toFixed(3)}
            </Text>
            <Button rightIcon={<ChevronDownIcon />} p={2} onClick={onOpen}>
              <Image src={selectedCoin?.Logo} boxSize={7}></Image>
            </Button>
          </HStack>
          <Input
            h={20}
            borderRadius="3xl"
            placeholder="Please enter the value."
            value={userInput.valueInput}
            onChange={handleUserInput}
            name="valueInput"
          ></Input>
        </VStack>

        <Button
          w="full"
          h={20}
          colorScheme="twitter"
          borderRadius="3xl"
          rightIcon={<TbArrowsDoubleNeSw />}
          onClick={handleTransfer}
          isLoading={
            stateToken.status === 'Mining' ||
            stateToken.status === 'PendingSignature' ||
            stateNative.status === 'Mining' ||
            stateNative.status === 'PendingSignature'
          }
        >
          Transfer
        </Button>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent
          borderRadius="50px"
          bgColor={useColorModeValue('gray.50', 'gray.800')}
          py={5}
        >
          <ModalCloseButton />
          <ModalHeader fontWeight="bold" fontSize="3xl">
            Please select the coin to transfer.
          </ModalHeader>
          <ModalBody>
            <VStack p={5} spacing={5}>
              <HStack
                w="full"
                bgColor={useColorModeValue('gray.50', 'gray.900')}
                p={5}
                borderRadius="3xl"
                cursor="pointer"
                onClick={() => {
                  // @ts-ignore
                  setSelectedCoin(currentNetwork?.Native);
                  onClose();
                }}
              >
                <Heading size="md">{currentNetwork?.Native?.Symbol}</Heading>
                <Spacer />
                <Image src={currentNetwork?.Native?.Logo} boxSize={10}></Image>
              </HStack>
              <HStack
                w="full"
                bgColor={useColorModeValue('gray.50', 'gray.900')}
                p={5}
                borderRadius="3xl"
                cursor="pointer"
                onClick={() => {
                  // @ts-ignore
                  setSelectedCoin(currentNetwork?.USDT);
                  onClose();
                }}
              >
                <Heading size="md">{currentNetwork?.USDT?.Symbol}</Heading>
                <Spacer />
                <Image src={currentNetwork?.USDT?.Logo} boxSize={10}></Image>
              </HStack>
              <HStack
                w="full"
                bgColor={useColorModeValue('gray.50', 'gray.900')}
                p={5}
                borderRadius="3xl"
                cursor="pointer"
                onClick={() => {
                  setSelectedCoin(currentNetwork?.Token);
                  onClose();
                }}
              >
                <Heading size="md">{currentNetwork?.Token?.Symbol}</Heading>
                <Spacer />
                <Image src={currentNetwork?.Token?.Logo} boxSize={10}></Image>
              </HStack>
              <HStack
                w="full"
                bgColor={useColorModeValue('gray.50', 'gray.900')}
                p={5}
                borderRadius="3xl"
                cursor="pointer"
                onClick={() => {
                  setSelectedCoin(currentNetwork?.ANUSD);
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
            <Button
              colorScheme="red"
              onClick={onClose}
              rightIcon={<CloseIcon />}
              size="lg"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </CardContainer>
  );
};
