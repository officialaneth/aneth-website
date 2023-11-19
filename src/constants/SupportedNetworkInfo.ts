import { BSCTestnet, ERC20Interface, Polygon } from '@usedapp/core';
import { Contract } from 'ethers';
import {
  ANUSDLogoSVG,
  PolygonLogoSVG,
  tokenLogoSVG,
  USDTLogoSVG,
} from '../assets';

import ContactDetailsInterface from '../contracts/artifacts/contracts/ContactDetails.sol/ContactDetailsUpgradeable.json';
import UniswapV2RouterInterface from '../contracts/artifacts/contracts/PresaleUpgradeable.sol/IUniswapRouter.json';
import PresaleInterface from '../contracts/artifacts/contracts/PresaleUpgradeable.sol/PresaleUpgradeable.json';
import ReferralInterface from '../contracts/artifacts/contracts/ReferralUpgradeable.sol/ReferralUpgradeable.json';
import StakingInterface from '../contracts/artifacts/contracts/StakingUpgradeable.sol/StakingUpgradeable.json';
import MonthlyRewardsInterface from '../contracts/artifacts/contracts/MonthlyRewards.sol/MonthlyRewardsUpgradeable.json';

export const TokenName = 'an.eth';
export const TokenSymbol = 'an.eth';
export const ProjectName = 'Aneth Technologies Limited';
export const TokenLogo = tokenLogoSVG;
export const ANUSDLogo = ANUSDLogoSVG;
export const DefaultReferrer = '0xf3ba579d4afd4dad8a8c2d1bcbdd1405688e492f';

export const PresaleEndsIn = '1 July, 2023';

export const DefaultChainId = 97;

export const AddressZero = '0x0000000000000000000000000000000000000000';

export const StakingInfo = {
  rewardRate: 100,
  duration: 10,
  minValue: 0.001,
  packages: [0],
};

export const website = `${window.location.origin}/#/swap`;

export const DeepLinks = {
  trustwallet: `https://link.trustwallet.com/open_url?coin_id=966&url=${website}`,
  metamask: `https://metamask.app.link/dapp/${website}`,
  coinbase: `https://go.cb-w.com/dapp?cb_url=${website}`,
};

export const useSupportedNetworkInfo = {
  [Polygon.chainId]: {
    variablesContract: '0x77daaFc7411C911b869C71bf70FE36cCE507845d',
    uniswapV2RouterContract: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    uniswapV2RouterContractInterface: new Contract(
      '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
      UniswapV2RouterInterface?.abi
    ),
    presaleContract: '0x75703ea2Bb07ae89ae1bcbB7fA663F1CE4dC5499',
    presaleContractInterface: new Contract(
      '0x75703ea2Bb07ae89ae1bcbB7fA663F1CE4dC5499',
      PresaleInterface?.abi
    ),
    referralContract: '0x6447fa83c1850bcf8c933fAe42FC0bC0f8491867',
    referralContractInterface: new Contract(
      '0x6447fa83c1850bcf8c933fAe42FC0bC0f8491867',
      ReferralInterface.abi
    ),
    stakingContractAddress: '0x44D0818CF7029c022D1558B556BbfB353572Bb26',
    stakingContractInterface: new Contract(
      '0x44D0818CF7029c022D1558B556BbfB353572Bb26',
      StakingInterface?.abi
    ),
    stakingV2ContractAddress: '0xB8dEA95FFC442e1eDc6E9c5353E1C3EBcB6D3750',
    stakingV2ContractInterface: new Contract(
      '0xB8dEA95FFC442e1eDc6E9c5353E1C3EBcB6D3750',
      StakingInterface?.abi
    ),
    contactDetailsContractAddress: '0xbcC00f99D29Df2A281F14FDB6342F9E73B4802D1',
    contactDetailsContractInterface: new Contract(
      '0xbcC00f99D29Df2A281F14FDB6342F9E73B4802D1',
      ContactDetailsInterface?.abi
    ),
    monthlyRewardsContractAddress: '0x4DfAE2aA0a2136e2c1d05d3b8708001Cf83a8707',
    monthlyRewardsContractInterface: new Contract(
      '0x4DfAE2aA0a2136e2c1d05d3b8708001Cf83a8707',
      MonthlyRewardsInterface?.abi
    ),
    Token: {
      ContractAddress: '0x89c701DCcC25e48566aF89cAC1e32706c5B55546',
      ContractInterface: new Contract(
        '0x89c701DCcC25e48566aF89cAC1e32706c5B55546',
        ERC20Interface
      ),
      Name: 'an.eth',
      Symbol: 'an.eth',
      Decimals: 18,
      Logo: TokenLogo,
    },
    ANUSD: {
      ContractAddress: '0xe6ffee89beb3bee2785eE88deD4Da74F8a082A78',
      ContractInterface: new Contract(
        '0xe6ffee89beb3bee2785eE88deD4Da74F8a082A78',
        ERC20Interface
      ),
      Name: 'an.usd',
      Symbol: 'an.usd',
      Decimals: 18,
      Logo: ANUSDLogo,
    },
    USDT: {
      ContractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      ContractInterface: new Contract(
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        ERC20Interface
      ),
      Name: 'Tether USDT',
      Symbol: 'USDT',
      Decimals: 6,
      Logo: USDTLogoSVG,
    },
    Native: {
      ContractAddress: '',
      ContractInterface: '',
      Name: 'Polygon',
      Symbol: 'MATIC',
      Decimals: 18,
      Logo: PolygonLogoSVG,
    },
    Network: BSCTestnet,
    NetworkRPCUrl: 'https://rpc-mainnet.matic.quiknode.pro',
    NetworkColor: 'purple',
    NetworkExplorerLink: Polygon.blockExplorerUrl,
    NetworkExplorerName: 'PolygonScan',
    NetworkExplorerLogo: PolygonLogoSVG,
  },
};
