import {
  Box,
  chakra,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
  Input,
  IconButton,
  useColorModeValue,
  Flex,
  VStack,
  Button,
  Image,
  Icon,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { BiMailSend } from 'react-icons/bi';
import { Logo } from '../Logo/Logo';
import { ProjectName, useSupportedNetworkInfo } from '../../constants';
import { PolygonLogoSVG } from '../../assets';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Polygon } from '@usedapp/core';
import { Link as RouterLink } from 'react-router-dom';

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      target="_blank"
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

export function Footer() {
  const currentNetwork = useSupportedNetworkInfo[Polygon.chainId];
  return (
    <Flex
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      flex={1}
    >
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 2fr' }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Logo />
            <Text fontSize={'sm'}>
              © 2022-2023 {ProjectName}. All rights reserved
            </Text>
            <Stack direction={'row'} spacing={6}>
              <SocialButton label={'Twitter'} href={'https://x.com/AnethGroup'}>
                <FaTwitter />
              </SocialButton>
              <SocialButton
                label={'YouTube'}
                href={'https://youtube.com/@AnEthCoin83?si=RySBQlRgbfqOhKzq'}
              >
                <FaYoutube />
              </SocialButton>
              <SocialButton
                label={'Instagram'}
                href={' https://instagram.com/anethgroup_ofiicial'}
              >
                <FaInstagram />
              </SocialButton>
            </Stack>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Company</ListHeader>
            <Link as={RouterLink} to="/about-us">
              About us
            </Link>
            <Link as={RouterLink} to="/exchange-listings">
              Exchange
            </Link>
            <Link as={RouterLink} to="/swap">
              Staking
            </Link>
            <Link as={RouterLink} to="/testimonials">
              Testimonials
            </Link>
            {/* <Link href={'#'}>Contact us</Link> */}
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Support</ListHeader>
            {/* <Link href={'#'}>Help Center</Link> */}
            <Link as={RouterLink} to="/term-of-service">
              Terms of Service
            </Link>
            {/* <Link href={'#'}>Legal</Link> */}
            <Link as={RouterLink} to="/privacy-policy">
              Privacy Policy
            </Link>
            <Link as={RouterLink} to="/status">Status</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Stay up to date</ListHeader>
            <Stack direction={'row'}>
              <Input
                placeholder={'Your email address'}
                bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
                border={0}
                _focus={{
                  bg: 'whiteAlpha.300',
                }}
              />
              <IconButton
                bg={useColorModeValue('green.400', 'green.800')}
                color={useColorModeValue('white', 'gray.800')}
                _hover={{
                  bg: 'green.600',
                }}
                aria-label="Subscribe"
                icon={<BiMailSend />}
              />
            </Stack>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Smart Contracts</ListHeader>
            <VStack w="max-content">
              <Button
                leftIcon={<Image src={PolygonLogoSVG} boxSize={5} />}
                rightIcon={<Icon as={ExternalLinkIcon} color="pink.500"></Icon>}
                as="a"
                href={Polygon.getExplorerAddressLink(
                  currentNetwork?.Token.ContractAddress
                )}
                target="_blank"
                w="full"
              >
                an.eth
              </Button>
              <Button
                leftIcon={<Image src={PolygonLogoSVG} boxSize={5} />}
                rightIcon={<Icon as={ExternalLinkIcon} color="pink.500"></Icon>}
                as="a"
                href={Polygon.getExplorerAddressLink(
                  currentNetwork?.ANUSD.ContractAddress
                )}
                target="_blank"
                w="full"
              >
                an.usd
              </Button>
              <Button
                leftIcon={<Image src={PolygonLogoSVG} boxSize={5} />}
                rightIcon={<Icon as={ExternalLinkIcon} color="pink.500"></Icon>}
                as="a"
                href={Polygon.getExplorerAddressLink(
                  currentNetwork?.presaleContract
                )}
                target="_blank"
              >
                Presale Smart Contracts
              </Button>
              <Button
                leftIcon={<Image src={PolygonLogoSVG} boxSize={5} />}
                rightIcon={<Icon as={ExternalLinkIcon} color="pink.500"></Icon>}
                as="a"
                href={Polygon.getExplorerAddressLink(
                  currentNetwork?.referralContract
                )}
                target="_blank"
              >
                Referral Smart Contracts
              </Button>
              <Button
                leftIcon={<Image src={PolygonLogoSVG} boxSize={5} />}
                rightIcon={<Icon as={ExternalLinkIcon} color="pink.500"></Icon>}
                as="a"
                href={Polygon.getExplorerAddressLink(
                  currentNetwork?.stakingContractAddress
                )}
                target="_blank"
              >
                Staking Smart Contracts
              </Button>
              <Button
                leftIcon={<Image src={PolygonLogoSVG} boxSize={5} />}
                rightIcon={<Icon as={ExternalLinkIcon} color="pink.500"></Icon>}
                as="a"
                href={Polygon.getExplorerAddressLink(
                  currentNetwork?.variablesContract
                )}
                target="_blank"
              >
                Variables Smart Contracts
              </Button>
              <Button
                leftIcon={<Image src={PolygonLogoSVG} boxSize={5} />}
                rightIcon={<Icon as={ExternalLinkIcon} color="pink.500"></Icon>}
                as="a"
                href={Polygon.getExplorerAddressLink(
                  currentNetwork?.contactDetailsContractAddress
                )}
                target="_blank"
                w="full"
              >
                Contact Details Contract
              </Button>
              {/* <Button
                leftIcon={<Image src={PolygonLogoSVG} boxSize={5} />}
                rightIcon={<Icon as={ExternalLinkIcon} color="pink.500"></Icon>}
                as="a"
                href={Polygon.getExplorerAddressLink(
                  currentNetwork?.presaleContract
                )}
                target="_blank"
              >
                Variables Smart Contracts
              </Button> */}
            </VStack>
          </Stack>
        </SimpleGrid>
      </Container>
    </Flex>
  );
}
