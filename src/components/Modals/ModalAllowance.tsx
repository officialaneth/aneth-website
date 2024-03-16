import { ChevronRightIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  Image,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spacer,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useContractFunction, useEthers } from '@usedapp/core';
import { Contract, utils } from 'ethers';
import { useEffect, useState } from 'react';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { useSupportedNetworkInfo } from '../../constants';

interface tokenObject {
  ContractAddress: string;
  ContractInterface: Contract;
  Name: string;
  Symbol: string;
  Decimals: number;
  Logo: string;
}

export const ModalAllowance = ({
  tokenObject,
  spenderAddress,
  valueToApprove,
  onClose,
}: {
  tokenObject: tokenObject;
  spenderAddress: string;
  valueToApprove: string;
  onClose?: () => void;
}) => {
  const toast = useToast();
  const [transactionStatus, setTransactionStatus] = useState<
    'Mining' | 'Success' | 'Loading' | 'No' | 'Error'
  >('No');
  const { send, state, resetState } = useContractFunction(
    tokenObject.ContractInterface,
    'approve'
  );

  const handleApprove = async () => {
    try {
      setTransactionStatus('Loading');
      await send(
        spenderAddress,
        utils.parseUnits(valueToApprove, tokenObject?.Decimals),
        {
          value: 0,
        }
      );
    } catch (err: any) {
      console.log(err);
      setTransactionStatus('No');
      toast({
        title: 'Error in Approving the transaction.',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (state.status === 'Exception') {
      toast({
        title: state.errorMessage,
        description: '',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      onClose!();
      resetState();
    } else if (state.status === 'Mining') {
      setTransactionStatus('Loading');
    } else if (state.status === 'Success') {
      toast({
        title: 'Transaction Approved.',
        description: '',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setTransactionStatus('No');
      resetState();
    }
  }, [state.status, resetState]);

  return (
    <VStack spacing={0}>
      <ModalHeader textAlign="center" fontSize="md">
        Insufficient Allowance <Icon as={WarningIcon} color="red"></Icon>
      </ModalHeader>
      <Center w={300} pb={5}>
        <Divider />
      </Center>
      <Text size="sm">Please allow the transaction to proceed.</Text>
      <ModalBody w="full" px={10}>
        <HStack spacing={5} p={5} w="full">
          <VStack
            cursor="pointer"
            onClick={() => {
              onClose!();
            }}
          >
            <Image boxSize={10} src={tokenObject.Logo}></Image>
            <Heading size="sm" opacity={0.75}>
              {tokenObject.Symbol}
            </Heading>
          </VStack>
          <Spacer />
          <VStack spacing={0}>
            <Text fontSize="sm">Approve</Text>
            <Icon as={FaLongArrowAltRight} boxSize={10}></Icon>
          </VStack>
          <Spacer />
          <Text>{valueToApprove}</Text>
        </HStack>
      </ModalBody>
      <ModalFooter>
        <HStack>
          <Button colorScheme="red" borderRadius="xl" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="green"
            borderRadius="xl"
            w={200}
            onClick={handleApprove}
            rightIcon={<ChevronRightIcon />}
            isLoading={transactionStatus === 'Loading'}
          >
            Proceed
          </Button>
        </HStack>
      </ModalFooter>
    </VStack>
  );
};
