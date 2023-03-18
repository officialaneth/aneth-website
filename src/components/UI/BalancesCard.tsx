import {
  Card,
  Heading,
  HStack,
  Icon,
  Image,
  Skeleton,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { IconType } from "react-icons";

export const BalancesCard = ({
  currencyName,
  currencyValue,
  logo,
  icon,
  isLoaded,
}: {
  currencyName: string;
  currencyValue: string;
  logo?: string;
  icon?: IconType;
  isLoaded: boolean;
}) => {
  return (
    <Skeleton borderRadius="25px" isLoaded={isLoaded} w="full">
      <Card
        borderRadius="3xl"
        w="full"
        p={3}
        bgColor={useColorModeValue("green.100", "whiteAlpha.200")}
      >
        <HStack justify="space-around">
          <VStack>
            <Heading size="sm" color="pink.500" fontWeight="semibold">
              {currencyName}
            </Heading>
            <Heading size="sm" wordBreak="break-all" fontWeight="semibold">
              {currencyValue}
            </Heading>
          </VStack>
          {logo && <Image src={logo} boxSize={8}></Image>}
          {icon && <Icon as={icon} boxSize={8}></Icon>}
        </HStack>
      </Card>
    </Skeleton>
  );
};
