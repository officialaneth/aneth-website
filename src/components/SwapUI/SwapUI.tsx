import {
  Button,
  Divider,
  Heading,
  HStack,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Tag,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  useContractFunction,
  useEthers,
  useTokenAllowance,
  useTokenBalance,
} from "@usedapp/core";
import { utils } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DefaultReferrer,
  TokenSymbol,
  useSupportedNetworkInfo,
} from "../../constants";
import { usePresaleCapping } from "../../hooks/PresaleHooks";
import { useUniswapTokenOut } from "../../hooks/UniswapV2Hooks";
import { Logo } from "../Logo/Logo";
import { ModalAllowance } from "../Modals/ModalAllowance";
import { ModalConfirmTransactionSwap } from "../Modals/ModalConfirmTransactionSwap";
import { ModalTransactionInProgress } from "../Modals/ModalTransactionInProgress/ModalTransactionInProgress";
import { ModalTransactionSuccess } from "../Modals/ModalTransactionSuccess/ModalTransactionSuccess";
import { ValueSelectButtons } from "../ValueSelectButtons";
import { CurrencyInput } from "./CurrencyInput";

export const SwapUI = () => {
  const { referrerAddress } = useParams();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account, chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];

  const tokenPrice = useUniswapTokenOut(
    1,
    currentNetwork?.Token?.ContractAddress,
    currentNetwork?.ANUSD?.ContractAddress
  );

  const presaleCapping = usePresaleCapping();

  const userANUSDBalance = useTokenBalance(
    currentNetwork?.ANUSD?.ContractAddress,
    account
  );

  const userTokenBalance = useTokenBalance(
    currentNetwork?.Token?.ContractAddress,
    account
  );
  const userANUSDAllowance = useTokenAllowance(
    currentNetwork?.ANUSD?.ContractAddress,
    account,
    currentNetwork?.presaleContract
  );

  const { send, state, resetState } = useContractFunction(
    currentNetwork?.presaleContractInterface,
    "BuyWithANUSD"
  );

  const [userInput, setUserInput] = useState<{
    anusd: number | undefined;
    token: number | undefined;
    referrer: string;
  }>({
    anusd: undefined,
    token: undefined,
    referrer: referrerAddress ?? DefaultReferrer,
  });

  const HandleanusdInput = (e: number) => {
    setUserInput((prev) => ({
      ...prev,
      anusd: e,
      token: e ? e / tokenPrice : undefined,
    }));
  };

  const handleTokenInput = (e: number) => {
    setUserInput((prev) => ({
      ...prev,
      token: e,
      anusd: e ? e * tokenPrice : undefined,
    }));
  };
  const handleSwap = () => {
    if (userInput?.anusd! < presaleCapping?.minConUSD) {
      toast({
        title: "Value less then min contribution.",
        description: `Please enter the value equal to or greater ${presaleCapping?.minConUSD} ${currentNetwork?.ANUSD?.Symbol}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (userInput?.anusd! > Number(formatEther(userANUSDBalance ?? 0))) {
      toast({
        title: "Insufficient Balance.",
        description: `Please enter the value equal to or less then your balance ${Number(
          formatEther(userANUSDBalance ?? 0)
        ).toFixed(5)}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      onOpen();
    }
  };
  const proceedSwap = async () => {
    try {
      await send(parseEther(`${userInput?.anusd!}`), {
        value: 0,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (state.status === "Exception") {
      toast({
        title: state.errorMessage,
        description: "",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      resetState();
    } else if (state.status === "Success") {
      setUserInput(() => ({
        anusd: undefined,
        token: undefined,
        referrer: "",
      }));
      setTimeout(() => {
        onClose();
        resetState();
      }, 10000);
    }
  }, [state.status, resetState, onClose]);

  return (
    <VStack
      w="full"
      maxW={400}
      minW={300}
      bgColor={useColorModeValue("gray.50", "gray.900")}
      borderRadius="3xl"
      boxShadow="sm"
      p={5}
    >
      <HStack>
        <Heading size="md" color="twitter.500">
          Swap
        </Heading>
        <Logo />
      </HStack>
      <Divider />

      <VStack w="full" py={5} spacing={5}>
        <VStack w="full">
          {referrerAddress && (
            <VStack w="full">
              <Heading size="sm">Referrer Address</Heading>
              <Input
                borderRadius="3xl"
                h={20}
                borderBottomWidth={5}
                value={userInput?.referrer}
                isReadOnly
                isDisabled={!account}
              ></Input>
            </VStack>
          )}

          <CurrencyInput
            symbol={currentNetwork?.ANUSD.Symbol}
            balance={Number(
              Number(
                utils.formatUnits(
                  userANUSDBalance ?? 0,
                  currentNetwork?.ANUSD.Decimals
                )
              ).toFixed(3)
            )}
            placeholder={`Please enter the ${currentNetwork?.ANUSD.Symbol} value.`}
            onChange={HandleanusdInput}
            inputValue={userInput?.anusd}
            style={{
              w: "full",
              isDisabled: !account,
              isInvalid: userInput.anusd!
                ? userInput.anusd < presaleCapping?.minConUSD
                : false,
              color:
                userInput.anusd! && userInput.anusd < presaleCapping?.minConUSD
                  ? "red"
                  : "inherit",
            }}
          />
          {userInput?.anusd! &&
            userInput?.anusd! < presaleCapping?.minConUSD && (
              <Text color="red" w="full" px={5}>
                * Min buying value is {presaleCapping?.minConUSD}{" "}
                {currentNetwork?.ANUSD?.Symbol}
              </Text>
            )}

          <ValueSelectButtons
            style={{
              w: "full",
              h: 14,
              borderRadius: "2xl",
              colorScheme: "twitter",
              opacity: 0.75,
              isDisabled: !account,
            }}
            onClick25={() =>
              HandleanusdInput(
                (Number(formatEther(userANUSDBalance ?? 0)) * 25) / 100
              )
            }
            onClick50={() =>
              HandleanusdInput(
                (Number(formatEther(userANUSDBalance ?? 0)) * 50) / 100
              )
            }
            onClick75={() =>
              HandleanusdInput(
                (Number(formatEther(userANUSDBalance ?? 0)) * 75) / 100
              )
            }
            onClickMax={() =>
              HandleanusdInput(Number(formatEther(userANUSDBalance ?? 0)))
            }
          />
        </VStack>
        <CurrencyInput
          symbol={currentNetwork?.Token.Symbol}
          balance={Number(
            Number(
              utils.formatUnits(
                userTokenBalance ?? 0,
                currentNetwork?.Token.Decimals
              )
            ).toFixed(3)
          )}
          placeholder={`Please enter the ${currentNetwork?.Token.Symbol} value.`}
          onChange={handleTokenInput}
          inputValue={userInput?.token}
          style={{
            w: "full",
            isDisabled: !account,
          }}
        />
        <Tag p={3} borderRadius="xl" fontWeight={900} colorScheme="twitter">
          1 {TokenSymbol} = {tokenPrice.toFixed(2)}{" "}
          {currentNetwork?.ANUSD.Symbol}
        </Tag>
        <Button
          w="full"
          h={20}
          borderRadius="3xl"
          colorScheme="twitter"
          bg="twitter.500"
          _hover={{
            bg: "twitter.600",
          }}
          opacity={0.75}
          isDisabled={!account || !userInput?.anusd}
          onClick={handleSwap}
        >
          {!account
            ? "Please connect wallet"
            : !userInput?.anusd
            ? "Please enter amount"
            : "Swap"}
        </Button>
      </VStack>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          if (state.status === "Success") {
            resetState();
          }
        }}
        isCentered
      >
        <ModalOverlay></ModalOverlay>
        <ModalContent borderRadius="3xl">
          <ModalCloseButton />
          {state?.status === "Success" && (
            <ModalTransactionSuccess
              onClose={() => {
                resetState();
                onClose();
              }}
              transactionHash={state.receipt?.transactionHash!}
            />
          )}
          {state?.status === "Mining" && <ModalTransactionInProgress />}
          {(state?.status === "None" || state?.status === "PendingSignature") &&
            (Number(formatEther(userANUSDAllowance ?? 0)) < userInput.anusd! ? (
              <ModalAllowance
                tokenName={currentNetwork?.ANUSD?.Symbol}
                spenderAddress={currentNetwork?.presaleContract}
                valueToApprove={`${userInput?.anusd! ?? 0}`}
                onClose={onClose}
              ></ModalAllowance>
            ) : (
              <ModalConfirmTransactionSwap
                currencySymbol={currentNetwork?.Token?.Symbol}
                onClose={onClose}
                onConfirm={proceedSwap}
                value={userInput?.token ?? 0}
              />
            ))}
        </ModalContent>
      </Modal>
    </VStack>
  );
};
