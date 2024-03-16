import {
  Button,
  Divider,
  Heading,
  HStack,
  Image,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  useContractFunction,
  useEthers,
  useTokenAllowance,
  useTokenBalance,
} from '@usedapp/core';
import { utils } from 'ethers';
import { formatEther, formatUnits, parseEther } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  AddressZero,
  DefaultReferrer,
  TokenSymbol,
  useSupportedNetworkInfo,
} from '../../constants';
import { usePresaleCapping } from '../../hooks/PresaleHooks';
import { useReferralUserAccount } from '../../hooks/ReferralHooks';
import { useUniswapTokenOut } from '../../hooks/UniswapV2Hooks';
import { Logo } from '../Logo/Logo';
import { ModalAllowance } from '../Modals/ModalAllowance';
import { ModalConfirmTransactionSwap } from '../Modals/ModalConfirmTransactionSwap';
import { ModalTransactionInProgress } from '../Modals/ModalTransactionInProgress/ModalTransactionInProgress';
import { ModalTransactionSuccess } from '../Modals/ModalTransactionSuccess/ModalTransactionSuccess';
import { ValueSelectButtons } from '../ValueSelectButtons';
import { CurrencyInput } from './CurrencyInput';

export const SwapUI = () => {
  const { referrerAddress } = useParams();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account, chainId } = useEthers();
  const currentNetwork = useSupportedNetworkInfo[chainId!];
  const userReferrerAddress = useReferralUserAccount(account ?? AddressZero);

  const [selectedCurrrency, setSelectedCurrrency] = useState(
    currentNetwork?.ANUSD
  );

  const tokenPrice = useUniswapTokenOut(
    1,
    currentNetwork?.Token?.ContractAddress,
    currentNetwork?.ANUSD?.ContractAddress,
    chainId
  );

  const presaleCapping = usePresaleCapping();

  const useGetSelectedCoinBalance = (address: string) => {
    return useTokenBalance(address, account);
  };

  const userCurrencyBalance = useGetSelectedCoinBalance(
    selectedCurrrency?.ContractAddress
  );

  // const userANUSDBalance = useTokenBalance(
  //   currentNetwork?.ANUSD?.ContractAddress,
  //   account
  // );

  const userTokenBalance = useTokenBalance(
    currentNetwork?.Token?.ContractAddress,
    account
  );
  const userCurrencyAllowance = useTokenAllowance(
    selectedCurrrency.ContractAddress,
    account,
    currentNetwork?.presaleContract
  );

  const { send, state, resetState } = useContractFunction(
    currentNetwork?.presaleContractInterface,
    'BuyWithANUSD'
  );

  const [userInput, setUserInput] = useState<{
    selectedCurrency: number | undefined;
    token: number | undefined;
  }>({
    selectedCurrency: undefined,
    token: undefined,
  });

  const getUserReferrerAddress = () => {
    if (userReferrerAddress?.referrer !== AddressZero) {
      return userReferrerAddress?.referrer;
    } else if (referrerAddress) {
      return referrerAddress;
    }

    return DefaultReferrer;
  };

  const errors = {
    valueLessThenMinContribution:
      userInput?.selectedCurrency! < presaleCapping?.minConUSD ? true : false,
    valueGreaterThenBalance:
      userInput?.selectedCurrency! >
      Number(formatUnits(userCurrencyBalance ?? 0, selectedCurrrency?.Decimals))
        ? true
        : false,
  };

  const HandleanusdInput = (e: number) => {
    setUserInput((prev) => ({
      ...prev,
      selectedCurrency: e,
      token: e ? e / tokenPrice : undefined,
    }));
  };

  const handleTokenInput = (e: number) => {
    setUserInput((prev) => ({
      ...prev,
      token: e,
      selectedCurrency: e ? e * tokenPrice : undefined,
    }));
  };

  const handleSwap = () => {
    if (errors.valueLessThenMinContribution) {
      toast({
        title: 'Value less then min contribution.',
        description: `Please enter the value equal to or greater ${presaleCapping?.minConUSD} ${currentNetwork?.ANUSD?.Symbol}.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else if (errors.valueGreaterThenBalance) {
      toast({
        title: 'Insufficient Balance.',
        description: `Please enter the value equal to or less then your balance ${Number(
          formatUnits(userCurrencyBalance ?? 0, selectedCurrrency?.Decimals)
        ).toFixed(5)}.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      onOpen();
    }
  };
  const proceedSwap = async () => {
    try {
      await send(
        getUserReferrerAddress(),
        account,
        parseEther(`${userInput?.selectedCurrency!}`),
        selectedCurrrency.ContractAddress,
        {
          value: 0,
        }
      );
    } catch (err) {
      console.log(err);
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
      onClose();
      resetState();
    } else if (state.status === 'Success') {
      setUserInput(() => ({
        selectedCurrency: undefined,
        token: undefined,
        referrer: '',
      }));
      setTimeout(() => {
        onClose();
        resetState();
      }, 10000);
    }
  }, [state, resetState, onClose, toast]);

  return (
    <VStack
      w="full"
      maxW={400}
      minW={300}
      bgColor={useColorModeValue('gray.50', 'gray.900')}
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
        <VStack w="full" spacing={5}>
          {referrerAddress && (
            <VStack w="full">
              <Heading size="sm">Referrer Address</Heading>
              <Input
                borderRadius="3xl"
                h={20}
                borderBottomWidth={5}
                value={getUserReferrerAddress()}
                isReadOnly
                isDisabled={!account}
              ></Input>
            </VStack>
          )}
          <Heading size="lg">Select Currency</Heading>
          <Tabs>
            <TabList>
              <Tab onClick={() => setSelectedCurrrency(currentNetwork?.ANUSD)}>
                {currentNetwork?.ANUSD?.Symbol}
              </Tab>
              <Tab onClick={() => setSelectedCurrrency(currentNetwork?.USDT)}>
                {currentNetwork?.USDT?.Symbol}
              </Tab>
            </TabList>
          </Tabs>
          <Image boxSize={10} src={selectedCurrrency?.Logo}></Image>

          <CurrencyInput
            symbol={selectedCurrrency?.Symbol}
            balance={Number(
              Number(
                utils.formatUnits(
                  userCurrencyBalance ?? 0,
                  selectedCurrrency?.Decimals
                )
              ).toFixed(3)
            )}
            placeholder={`Please enter the ${selectedCurrrency?.Symbol} value.`}
            onChange={HandleanusdInput}
            inputValue={userInput?.selectedCurrency}
            style={{
              w: 'full',
              isDisabled: !account,
              isInvalid: userInput.selectedCurrency!
                ? userInput.selectedCurrency < presaleCapping?.minConUSD
                : false,
              color:
                userInput.selectedCurrency! &&
                userInput.selectedCurrency < presaleCapping?.minConUSD
                  ? 'red'
                  : 'inherit',
            }}
          />
          {userInput?.selectedCurrency! &&
            userInput?.selectedCurrency! < presaleCapping?.minConUSD && (
              <Text color="red" w="full" px={5}>
                * Min buying value is {presaleCapping?.minConUSD}{' '}
                {selectedCurrrency?.Symbol}
              </Text>
            )}

          <ValueSelectButtons
            style={{
              w: 'full',
              h: 14,
              borderRadius: '2xl',
              colorScheme: 'twitter',
              opacity: 0.75,
              isDisabled: !account,
            }}
            onClick25={() =>
              HandleanusdInput(
                (Number(
                  formatUnits(
                    userCurrencyBalance ?? 0,
                    selectedCurrrency?.Decimals
                  )
                ) *
                  25) /
                  100
              )
            }
            onClick50={() =>
              HandleanusdInput(
                (Number(
                  formatUnits(
                    userCurrencyBalance ?? 0,
                    selectedCurrrency?.Decimals
                  )
                ) *
                  50) /
                  100
              )
            }
            onClick75={() =>
              HandleanusdInput(
                (Number(
                  formatUnits(
                    userCurrencyBalance ?? 0,
                    selectedCurrrency?.Decimals
                  )
                ) *
                  75) /
                  100
              )
            }
            onClickMax={() =>
              HandleanusdInput(
                Number(
                  formatUnits(
                    userCurrencyBalance ?? 0,
                    selectedCurrrency?.Decimals
                  )
                )
              )
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
            w: 'full',
            isDisabled: !account,
          }}
        />
        <Tag p={3} borderRadius="xl" fontWeight={900} colorScheme="twitter">
          1 {TokenSymbol} = {tokenPrice.toFixed(5)} {selectedCurrrency?.Symbol}
        </Tag>
        <Button
          w="full"
          h={20}
          borderRadius="3xl"
          colorScheme="twitter"
          bg="twitter.500"
          _hover={{
            bg: 'twitter.600',
          }}
          opacity={0.75}
          isDisabled={!account || !userInput?.selectedCurrency}
          onClick={handleSwap}
        >
          {!account
            ? 'Please connect wallet'
            : !userInput?.selectedCurrency
            ? 'Please enter amount'
            : 'Swap'}
        </Button>
      </VStack>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          if (state.status === 'Success') {
            resetState();
          }
        }}
        isCentered
      >
        <ModalOverlay></ModalOverlay>
        <ModalContent borderRadius="3xl">
          <ModalCloseButton />
          {state?.status === 'Success' && (
            <ModalTransactionSuccess
              onClose={() => {
                resetState();
                onClose();
              }}
              transactionHash={state.receipt?.transactionHash!}
            />
          )}
          {state?.status === 'Mining' && <ModalTransactionInProgress />}
          {(state?.status === 'None' || state?.status === 'PendingSignature') &&
            (Number(
              formatUnits(
                userCurrencyAllowance ?? 0,
                selectedCurrrency?.Decimals
              )
            ) < userInput.selectedCurrency! ? (
              <ModalAllowance
                tokenObject={selectedCurrrency}
                spenderAddress={currentNetwork?.presaleContract}
                valueToApprove={`${userInput?.selectedCurrency! ?? 0}`}
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
