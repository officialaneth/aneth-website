import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
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
    <HStack
      w="full"
      p={5}
      position="sticky"
      top={0}
      zIndex={11111}
      backdropFilter="blur(20px)"
    >
      <Logo />
      <Spacer></Spacer>
      <Hide below="sm">
        <ColorModeSwitcher />
      </Hide>
      <ConnectWalletButton />
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<HamburgerIcon />}
          colorScheme="twitter"
          bg="twitter.500"
          _hover={{
            bg: "twitter.600",
          }}
          borderRadius="xl"
        ></MenuButton>
        <NavMenu />
      </Menu>
    </HStack>
  );
};
