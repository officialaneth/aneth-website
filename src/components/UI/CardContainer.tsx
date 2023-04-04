import { Tag, useColorModeValue, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { ReactNode } from "react";

const MotionTag = motion(Tag);

export const CardContainer = ({ children }: { children: ReactNode }) => {
  return (
    <MotionTag
      borderRadius={["50px"]}
      px={[2, 5]}
      py={10}
      minW={200}
      bgColor={useColorModeValue("twitter.100", "whiteAlpha.50")}
      boxShadow="base"
      whileHover={{
        borderRadius: "75px",
        scale: 0.98,
      }}
      whileTap={{
        borderRadius: "75px",
        scale: 0.98,
      }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 700,
      }}
    >
      <VStack spacing={5} w="full">
        {children}
      </VStack>
    </MotionTag>
  );
};
