import {
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useUniswapTokenOut } from "../../hooks/UniswapV2Hooks";

export const CurrencyInput = ({
  symbol,
  balance,
  placeholder,
  inputValue,
  style,
  onChange,
}: {
  symbol: string;
  balance: number | undefined;
  placeholder: string;
  inputValue: number | undefined;
  style?: NumberInputProps;
  onChange?: (e: any) => void;
}) => {
  return (
    <VStack w="full">
      <HStack w="full" justify="space-between">
        <Tag colorScheme="twitter">
          <Text>Balance</Text>
        </Tag>
        <Tag colorScheme="twitter">
          <Text>
            {balance ?? 0} {symbol}
          </Text>
        </Tag>
      </HStack>
      <NumberInput {...style} onChange={onChange} value={inputValue}>
        <NumberInputField
          h={20}
          borderRadius="3xl"
          fontSize="lg"
          borderBottomWidth={5}
          placeholder={placeholder}
        />
      </NumberInput>
    </VStack>
  );
};
