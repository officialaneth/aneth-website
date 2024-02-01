import {
  Center,
  Circle,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

export const Status = () => {
  return (
    <VStack>
      <Flex direction="column" gap={10} maxW={1000}>
        <Heading>Service Status</Heading>
        <HStack>
          <Center boxSize={4} bgColor="green.500" borderRadius="full"></Center>
          <Text>All systems are online.</Text>
        </HStack>
      </Flex>
    </VStack>
  );
};
