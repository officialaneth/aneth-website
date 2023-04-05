import {
  Button,
  Hide,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { shortenAddress, useEthers } from "@usedapp/core";
import { motion, MotionConfig } from "framer-motion";
import { ConnectWalletModal, WalletModal } from "../Modals";

const MotionModalContent = motion(ModalContent);

export const ConnectWalletButton = () => {
  const { account } = useEthers();
  const { onOpen, isOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme="twitter"
        bg="twitter.500"
        _hover={{
          bg: "twitter.600",
        }}
        borderRadius="xl"
      >
        <Text fontSize="sm">
          {account ? (
            shortenAddress(account)
          ) : (
            <>
              Connect <Hide below="sm">Wallet</Hide>
            </>
          )}
        </Text>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(5px)" />
        <MotionConfig
          transition={{
            duration: 0.25,
          }}
        >
          <MotionModalContent
            w="95%"
            animate={{
              opacity: [0, 1],
              scale: [0, 1],
              y: ["100%", "0%"],
            }}
            borderRadius="3xl"
          >
            <ModalCloseButton />
            {account ? (
              <WalletModal onClose={onClose}></WalletModal>
            ) : (
              <ConnectWalletModal onClose={onClose} />
            )}
          </MotionModalContent>
        </MotionConfig>
      </Modal>
    </>
  );
};
