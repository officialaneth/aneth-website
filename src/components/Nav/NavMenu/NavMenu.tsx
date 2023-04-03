import {
  Divider,
  HStack,
  Icon,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { FaChartBar, FaMoon, FaPiggyBank, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ConnectWalletButton } from "../../ConnectWalletButton/ConnectWalletButton";

export const NavMenu = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  return (
    <MenuList borderRadius="3xl" overflow="hidden" fontSize="sm" p={5}>
      <VStack w="full">
        <ConnectWalletButton />
        <VStack align="center" h="50vh" justify="center">
          <VStack>
            <MenuItem
              icon={<FaChartBar />}
              iconSpacing={5}
              borderRadius="xl"
              onClick={() => navigate("user")}
            >
              Dashboard
            </MenuItem>
            <MenuItem
              icon={<FaPiggyBank />}
              iconSpacing={5}
              borderRadius="xl"
              onClick={() => navigate("swap")}
            >
              Swap
            </MenuItem>
          </VStack>
        </VStack>
        <Divider></Divider>
        <HStack w="full" pt={2} cursor="pointer" onClick={toggleColorMode}>
          <Text>{useColorModeValue("Light", "Dark")} Theme</Text>
          <Spacer />
          <Icon as={useColorModeValue(FaSun, FaMoon)}></Icon>
        </HStack>
      </VStack>
    </MenuList>
  );
};
