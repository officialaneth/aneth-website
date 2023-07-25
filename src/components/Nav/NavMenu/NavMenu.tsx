import {
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import { FaChartBar, FaMoon, FaPiggyBank, FaSun } from 'react-icons/fa';
import { GiFlame, GiFlameClaws } from 'react-icons/gi';
import { IoIosFlame } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { TokenSymbol } from '../../../constants';
import { ConnectWalletButton } from '../../ConnectWalletButton/ConnectWalletButton';
import { navUser } from '../NavMenuItems';

export const NavMenu = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const { account } = useEthers();
  const { userAddress } = useParams();
  return (
    <MenuList borderRadius="3xl" overflow="hidden" fontSize="sm" p={5}>
      <VStack w="full">
        <ConnectWalletButton />
        <VStack justify="center" w="full">
          {account && (
            <VStack w="full" py={[5, 10, 20]}>
              {navUser.map((navObject, key) => {
                return (
                  <MenuItem
                    borderRadius="xl"
                    onClick={() =>
                      navigate(
                        !userAddress
                          ? `${navObject?.link}`
                          : `${navObject?.link}/${userAddress}`
                      )
                    }
                    key={key}
                  >
                    <HStack w={100} spacing={5}>
                      <Icon as={navObject?.icon} />
                      <Text>{navObject.name}</Text>
                    </HStack>
                  </MenuItem>
                );
              })}
            </VStack>
          )}
          <MenuItem borderRadius="xl" onClick={() => navigate('/swap')} py={2}>
            <HStack w={100} spacing={5}>
              <Icon as={IoIosFlame} boxSize={7} color="pink.500" />
              <Heading size="sm">Swap</Heading>
            </HStack>
          </MenuItem>
        </VStack>
        <Divider></Divider>
        <HStack w="full" pt={2} cursor="pointer" onClick={toggleColorMode}>
          <Text>{useColorModeValue('Light', 'Dark')} Theme</Text>
          <Spacer />
          <Icon as={useColorModeValue(FaSun, FaMoon)}></Icon>
        </HStack>
      </VStack>
    </MenuList>
  );
};
