import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Hide,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { ConnectWalletButton } from "../ConnectWalletButton/ConnectWalletButton";
import { Logo } from "../Logo/Logo";
import { NavMenu } from "./NavMenu/NavMenu";

export const Nav = () => {
  return (
    <HStack w="full" p={5} bg={useColorModeValue("gray.50", "gray.900")}>
      <Logo />
      <Spacer></Spacer>
      <Hide below="sm">
        <ColorModeSwitcher />
      </Hide>
      <ConnectWalletButton />
      <Menu>
        <MenuButton as={IconButton} icon={<HamburgerIcon />}></MenuButton>

        <NavMenu />
      </Menu>
    </HStack>
  );
};
