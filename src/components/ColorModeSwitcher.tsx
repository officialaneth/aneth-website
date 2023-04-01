import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Center,
  HStack,
  Icon,
  IconButton,
  IconButtonProps,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import * as React from "react";
import { FaMoon, FaSun } from "react-icons/fa";

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">;

const MotionCenter = motion(Center);
const MotionIconButton = motion(IconButton);

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = (props) => {
  const { toggleColorMode } = useColorMode();

  return (
    <HStack
      p={1}
      bgColor={useColorModeValue("twitter.500", "gray.900")}
      w={10}
      cursor="pointer"
      borderRadius="full"
      onClick={() => {
        toggleColorMode();
      }}
      justify={useColorModeValue("flex-end", "flex-start")}
      borderWidth="thin"
    >
      <MotionCenter
        boxSize={5}
        borderRadius="full"
        layout
        transition={{
          type: "spring",
          stiffness: 700,
        }}
      >
        <Icon as={useColorModeValue(SunIcon, MoonIcon)} color="white"></Icon>
      </MotionCenter>
    </HStack>
  );
};
