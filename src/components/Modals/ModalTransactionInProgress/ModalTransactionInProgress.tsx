import {
  Center,
  Divider,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  VStack,
} from "@chakra-ui/react";

export const ModalTransactionInProgress = () => {
  return (
    <VStack spacing={0}>
      <ModalHeader textAlign="center" fontSize="md">
        Transaction in progress...
      </ModalHeader>
      <Center w={300}>
        <Divider />
      </Center>
      <ModalBody>
        <VStack w="full">
          <Spinner />
        </VStack>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </VStack>
  );
};
