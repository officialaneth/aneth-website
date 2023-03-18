import { useColorModeValue, VStack } from "@chakra-ui/react";
import React, { ReactNode } from "react";

export const CardContainer = ({ children }: { children: ReactNode }) => {
  return (
    <VStack
      p={5}
      spacing={5}
      borderRadius="2xl"
      bgColor={useColorModeValue("gray.100", "gray.900")}
      w="full"
      maxW={400}
    >
      {children}
    </VStack>
  );
};
