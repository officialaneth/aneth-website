import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Heading,
  HStack,
  Modal,
  ModalContent,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContractFunction, useEtherBalance, useEthers } from "@usedapp/core";
import { utils } from "ethers";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DefaultReferrer,
  StakingInfo,
  useSupportedNetworkInfo,
} from "../../constants";
import { ModalConfirmTransactionStake } from "../Modals";
import { ModalTransactionInProgress } from "../Modals/ModalTransactionInProgress/ModalTransactionInProgress";
import { ModalTransactionSuccess } from "../Modals/ModalTransactionSuccess/ModalTransactionSuccess";
import { StakingStats } from "../StakingInputStats";
import { ValueSelectButtons } from "../ValueSelectButtons";
import { ReferrerAddressInput } from "./ReferrerAddressInput";

export const StakingUI = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { referrerAddress } = useParams();
  const { account, chainId, error } = useEthers();
  console.log("Error", error);
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const [input, setInput] = useState<{
    value: number;
    finalValue: number;
    referrer: string;
    packageID: number;
  }>({
    value: 0,
    finalValue: 0,
    referrer: referrerAddress ?? "",
    packageID: 0,
  });

  const [transactionStatus, setTransactionStatus] = useState<
    "No" | "Loading" | "Mining" | "Success"
  >("No");

  const [transactionHash, setTransactionHash] = useState("");

  const userETHBalanceWei = useEtherBalance(account);
  const userETHBalance: number = userETHBalanceWei
    ? Number(utils.formatEther(userETHBalanceWei))
    : 0;

  const {
    send: sendStake,
    state: stateStake,
    resetState: resetStateStake,
  } = useContractFunction(currentNetwork?.stakingContractInterface, "stake");

  console.log(stateStake);

  const handleInput = (e: any) => {
    setInput((prev) => ({
      ...prev,
      value: e,
    }));
  };

  const handleMaxButton = (perc: number) => {
    setInput((prev) => ({
      ...prev,
      value: (userETHBalance * perc) / 100,
    }));
  };

  const handleReferrerInput = (e: any) => {
    setInput((prev) => ({ ...prev, referrer: e.target.value }));
  };

  const handleStake = () => {
    if (input?.referrer.length === 0) {
      toast({
        title: "No referrer address selected.",
        description: "Please enter the referrer address or select default one.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else if (userETHBalance < StakingInfo?.minValue) {
      toast({
        title: "Your balance is low.",
        description: "Your balance is less than min staking balance.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (input?.value > userETHBalance) {
      toast({
        title: "Your balance is low.",
        description: "Please enter the value less or equal to your balance.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (input?.value < StakingInfo?.minValue) {
      toast({
        title: "Value less then min staking value.",
        description: "Please enter the value above min staking value.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      onOpen();
    }
  };

  const proceedSwap = () => {
    try {
      setTransactionStatus("Loading");
      sendStake(input?.referrer, input?.packageID, {
        value: utils.parseEther(Number(input.value).toFixed(18)),
      });
    } catch (err) {
      setTransactionStatus("No");
      console.log(err);
    }
  };

  useEffect(() => {
    if (stateStake?.status === "Exception") {
      toast({
        title: "Error",
        description: `${stateStake?.errorMessage}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setTransactionStatus("No");
    }

    if (stateStake?.status === "Mining") {
      setTransactionStatus("Mining");
    }
    if (stateStake?.status === "Success") {
      setTransactionStatus("Success");
      setTransactionHash(stateStake?.receipt?.transactionHash ?? "");
      setTimeout(() => {
        onClose();
        setTransactionStatus("No");
        setTransactionHash("");
        resetStateStake();
      }, 15000);
    }
  }, [stateStake, toast, onClose]);

  return (
    <VStack
      w={300}
      bgColor={useColorModeValue("gray.50", "gray.900")}
      borderRadius="3xl"
      boxShadow="lg"
      p={5}
    >
      <Heading size="sm">Stake {currentNetwork?.Native?.Symbol}</Heading>
      <Divider />
      <HStack w="full" justify="space-between">
        <Text fontSize="xs">You have</Text>
        <Text fontSize="xs">
          {userETHBalance.toPrecision(3)} {currentNetwork?.Native?.Symbol}
        </Text>
      </HStack>
      <ReferrerAddressInput
        value={referrerAddress ?? input?.referrer}
        onChange={handleReferrerInput}
        isDisabled={referrerAddress ? true : false}
        isInvalid={
          referrerAddress !== undefined || input?.referrer.length === 0
        }
        onClear={() => setInput((prev) => ({ ...prev, referrer: "" }))}
        onSelectDefaultReferrer={() =>
          setInput((prev) => ({ ...prev, referrer: DefaultReferrer }))
        }
      />
      <FormControl
        isInvalid={
          input?.value > 0
            ? input?.value < StakingInfo?.minValue ||
              input?.value > userETHBalance
            : false
        }
      >
        <Stack>
          <FormHelperText>Please enter the amount to stake</FormHelperText>
          <NumberInput
            onChange={handleInput}
            value={input?.value > 0 ? input?.value : undefined}
            max={userETHBalance}
          >
            <NumberInputField h={14} placeholder="0.0" />
          </NumberInput>
          {input?.value < StakingInfo?.minValue && (
            <FormErrorMessage>
              Min staking value is {StakingInfo?.minValue}{" "}
              {currentNetwork?.Native?.Symbol}
            </FormErrorMessage>
          )}

          {input?.value > userETHBalance && (
            <FormErrorMessage>
              Value exceeding your {currentNetwork?.Native?.Symbol} balance
            </FormErrorMessage>
          )}

          <ValueSelectButtons
            onClick25={() => handleMaxButton(25)}
            onClick50={() => handleMaxButton(50)}
            onClick75={() => handleMaxButton(75)}
            onClickMax={() => handleMaxButton(100)}
            style={{
              colorScheme: "pink",
              isDisabled: !account,
              size: "sm",
              w: "full",
            }}
          />
        </Stack>
      </FormControl>
      <StakingStats
        inputValue={input?.value}
        currencySymbol={currentNetwork?.Native?.Symbol}
      ></StakingStats>
      <Button
        w="full"
        h={14}
        colorScheme="pink"
        isDisabled={!account || input?.value === 0}
        onClick={handleStake}
      >
        {account ? " Stake" : "Please connect wallet"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="3xl" w="95%">
          {transactionStatus === "Success" && (
            <ModalTransactionSuccess
              transactionHash={transactionHash}
              onClose={() => {
                onClose();
                setTransactionStatus("No");
                resetStateStake();
              }}
            />
          )}
          {transactionStatus === "Mining" && <ModalTransactionInProgress />}
          {(transactionStatus === "No" || transactionStatus === "Loading") && (
            <ModalConfirmTransactionStake
              currencySymbol={currentNetwork?.Native?.Symbol}
              onClose={onClose}
              isLoading={transactionStatus === "Loading"}
              value={Number(input?.value).toFixed(3)}
              onConfirm={proceedSwap}
              children={
                <StakingStats
                  inputValue={input?.value}
                  currencySymbol={currentNetwork?.Native?.Symbol}
                ></StakingStats>
              }
            />
          )}
        </ModalContent>
      </Modal>
    </VStack>
  );
};
