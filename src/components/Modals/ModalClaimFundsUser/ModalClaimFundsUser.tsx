import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Heading,
  HStack,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spacer,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContractFunction, useEthers } from "@usedapp/core";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { useSupportedNetworkInfo } from "../../../constants";

export const ModalClaimFundsUser = ({
  fundsInDecimals,
  currencySymbol,
  onClose,
}: {
  fundsInDecimals: number;
  currencySymbol: string;
  onClose?: () => void;
}) => {
  const toast = useToast();
  const { chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const [transactionStatus, setTransactionStatus] = useState<
    "Mining" | "Success" | "Loading" | "No" | "Error"
  >("No");
  const { send, state, resetState } = useContractFunction(
    // @ts-ignore
    currentNetwork?.StakingInterface,
    "claimFundsUser"
  );
  const minWithDrawAmount = 8;
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState({
    inputGreaterThanBalance: false,
    inputLessThenMinWithdrawLimit: false,
  });

  const handleAmountInput = (e: any) => {
    setAmount(e.target.value);
    if (e.target.value > fundsInDecimals) {
      setError((prev) => ({ ...prev, inputGreaterThanBalance: true }));
    } else {
      setError((prev) => ({ ...prev, inputGreaterThanBalance: false }));
    }
    if (e.target.value <= minWithDrawAmount) {
      setError((prev) => ({ ...prev, inputLessThenMinWithdrawLimit: true }));
    } else {
      setError((prev) => ({ ...prev, inputLessThenMinWithdrawLimit: false }));
    }
  };

  const handleMaxButton = () => {
    setAmount(fundsInDecimals);
  };

  const handleClaim = async () => {
    try {
      setTransactionStatus("Loading");
      await send(
        parseUnits(amount.toString(), currentNetwork?.USDT?.Decimals),
        {
          value: 0,
        }
      );
      setTransactionStatus("No");
    } catch (err: any) {
      console.log(err);
      setTransactionStatus("No");
      toast({
        title: "Error in claiming funds.",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (state.status === "Mining") {
      setTransactionStatus("Loading");
    } else if (state.status === "Success") {
      setTransactionStatus("No");
      resetState();
    }
  }, [state, resetState]);

  return fundsInDecimals > minWithDrawAmount ? (
    <VStack spacing={0}>
      <ModalHeader textAlign="center" fontSize="md">
        Claim Your Staking Funds
      </ModalHeader>
      <Center w={300} pb={5}>
        <Divider />
      </Center>
      <ModalBody w="full">
        <HStack w="full">
          <Text>Available Funds</Text>
          <Spacer />
          <Text>{fundsInDecimals}</Text> <Text>{currencySymbol}</Text>
        </HStack>
        <VStack>
          <FormControl
            isInvalid={
              error?.inputGreaterThanBalance ||
              error?.inputLessThenMinWithdrawLimit
            }
          >
            <FormHelperText>Please enter the amount.</FormHelperText>
            <HStack>
              <Input
                value={amount}
                onChange={handleAmountInput}
                isInvalid={
                  error?.inputGreaterThanBalance ||
                  error?.inputLessThenMinWithdrawLimit
                }
              ></Input>
              <Button onClick={handleMaxButton}>Max</Button>
            </HStack>
          </FormControl>
          {error.inputGreaterThanBalance && (
            <Alert status="error" borderRadius="xl">
              <AlertIcon></AlertIcon>
              <Text>Input Greater than your balance.</Text>
            </Alert>
          )}
          <Alert status="error" borderRadius="xl">
            <AlertIcon></AlertIcon>
            <Text>Min claim amount $8</Text>
          </Alert>
        </VStack>
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
            onClick={handleClaim}
            rightIcon={<ChevronRightIcon />}
            isLoading={transactionStatus === "Loading"}
          >
            Claim
          </Button>
        </HStack>
      </ModalFooter>
    </VStack>
  ) : (
    <Box>
      <VStack w="full">
        <ModalHeader textAlign="center" fontSize="md">
          We cannot process...
        </ModalHeader>
        <Center w={300} pb={5}>
          <Divider />
        </Center>
      </VStack>
      <ModalBody w="full">
        <VStack spacing={5}>
          <HStack w="full">
            <Text>Available Funds</Text>
            <Spacer />
            <Text>{fundsInDecimals}</Text> <Text>{currencySymbol}</Text>
          </HStack>
          <VStack>
            <Heading size="md">You have Insufficient balance.</Heading>
          </VStack>
          <Alert status="error" borderRadius="xl">
            <AlertIcon></AlertIcon>
            <Text>Min claim amount $8</Text>
          </Alert>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="red" borderRadius="xl" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Box>
  );
};
