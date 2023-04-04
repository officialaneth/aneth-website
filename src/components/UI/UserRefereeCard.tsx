import { CheckIcon, CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  ButtonProps,
  Card,
  HStack,
  Icon,
  IconButton,
  Link,
  Text,
  useClipboard,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { shortenAddress } from "@usedapp/core";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";
import { UserAddressActionButton } from "./UserAddressActionButton";

const MotionCard = motion(Card);

export const UserRefereeCard = ({
  address,
  style,
  onClick,
}: {
  address: string | undefined;
  style?: ButtonProps;
  onClick?: () => void;
}) => {
  const { onCopy, hasCopied } = useClipboard(address!);
  return (
    <MotionCard
      p={5}
      borderRadius="25px"
      boxShadow="base"
      whileHover={{
        rotate: -10,
      }}
      whileTap={{
        rotate: -10,
      }}
    >
      <VStack w="full">
        <Icon as={FaUser} boxSize={7} onClick={onClick}></Icon>
        <Text fontSize="sm">{shortenAddress(address!)}</Text>
        <UserAddressActionButton address={address} style={style} />
      </VStack>
    </MotionCard>
  );
};
