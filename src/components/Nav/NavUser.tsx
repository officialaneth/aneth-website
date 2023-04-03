import {
  Avatar,
  AvatarBadge,
  Badge,
  Divider,
  Flex,
  Heading,
  HStack,
  Tag,
  useColorModeValue,
  VStack,
  Icon,
  Text,
  Spacer,
} from "@chakra-ui/react";
import { shortenAddress, useEthers } from "@usedapp/core";
import { motion, MotionProps } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { navUser } from "./NavMenuItems";
import { AiOutlineLogout } from "react-icons/ai";
import { IconType } from "react-icons";

const MotionTag = motion(Tag);

export const NavUser = () => {
  const { account, deactivate } = useEthers();
  const navigate = useNavigate();

  return (
    <Flex
      w={200}
      h={500}
      bgColor={useColorModeValue("gray.50", "gray.900")}
      borderRadius="50px"
      py={5}
      px={5}
      direction="column"
      gap={5}
      pos="sticky"
      top={0}
    >
      <HStack w="full">
        <Avatar>
          <AvatarBadge bgColor="green" boxSize={5}></AvatarBadge>
        </Avatar>

        <Badge borderRadius="xl" colorScheme="twitter">
          {shortenAddress(account ?? "")}
        </Badge>
      </HStack>

      <Divider />
      <Flex minH={300} justify="center" direction="column" flex={1} gap={3}>
        {navUser.map((items, key) => {
          return (
            <MotionTag
              fontSize="sm"
              w="full"
              justifyContent="center"
              p={2}
              borderRadius="xl"
              key={key}
              onClick={() => navigate(items?.link)}
              colorScheme={
                window.location.hash === items?.active ? "pink" : "gray"
              }
              bgColor="transparent"
              cursor="pointer"
              whileHover={{
                rotate: -10,
              }}
              whileTap={{
                rotate: -10,
              }}
            >
              <HStack
                _hover={{
                  color: "twitter.500",
                }}
              >
                <Icon as={items.icon}></Icon>
                <Text>{items?.name}</Text>
              </HStack>
            </MotionTag>
          );
        })}
      </Flex>
      <HStack>
        <ColorModeSwitcher />
        <Spacer />
        <Icon
          as={AiOutlineLogout}
          boxSize={7}
          color="red"
          onClick={deactivate}
          cursor="pointer"
        ></Icon>
      </HStack>
    </Flex>
  );
};
