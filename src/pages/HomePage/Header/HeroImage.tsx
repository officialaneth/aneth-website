import { Image, useColorModeValue, VStack } from "@chakra-ui/react";
import {
  AnimatePresence,
  ForwardRefComponent,
  HTMLMotionProps,
  motion,
} from "framer-motion";
import React, { useState } from "react";
import {
  AIVRHero,
  ETHVRHero,
  MetaETH,
  MetaverseVRHero,
  RocketVRHero,
  Web3VRHero,
  YogaVRHero,
} from "../../../assets";

const MotionImage = motion(Image);

export const HeroImage = () => {
  return (
    <VStack p={5} borderRadius="full">
      <MotionImage
        src={MetaETH}
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          type: "spring",
          stiffness: 500,
          repeat: Infinity,
        }}
        boxSize={[300, 300, 300, 400, 500]}
        filter={`drop-shadow(20px 10px 20px ${useColorModeValue(
          "#A0AEC0",
          "#1A202C"
        )})`}
      ></MotionImage>
    </VStack>
  );
};
