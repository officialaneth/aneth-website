import { CheckIcon, CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
  ButtonProps,
  Card,
  HStack,
  Icon,
  IconButton,
  Link,
  Tag,
  Text,
  useClipboard,
  useColorModeValue,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { shortenAddress } from '@usedapp/core';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaUser, FaUserFriends, FaUsers } from 'react-icons/fa';
import { useUserTotalBusiness } from '../../hooks/ReferralHooks';
import { UserAddressActionButton } from './UserAddressActionButton';

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
  const userTotalBusiness = useUserTotalBusiness(address!);
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
        <Wrap align="center" justify="center" w="full">
          <Tag>
            <HStack spacing={1}>
              <Icon as={FaUser}></Icon>
              <Icon as={FaShoppingCart}></Icon>
              <Text>{userTotalBusiness?.selfBusiness}</Text>
            </HStack>
          </Tag>
          <Tag>
            <HStack spacing={1}>
              <Icon as={FaUserFriends}></Icon>
              <Icon as={FaShoppingCart}></Icon>
              <Text>{userTotalBusiness?.directBusiness}</Text>
            </HStack>
          </Tag>
          <Tag>
            <HStack spacing={1}>
              <Icon as={FaUsers}></Icon>
              <Icon as={FaShoppingCart}></Icon>
              <Text>{userTotalBusiness?.totalBusiness}</Text>
            </HStack>
          </Tag>
        </Wrap>
      </VStack>
    </MotionCard>
  );
};
