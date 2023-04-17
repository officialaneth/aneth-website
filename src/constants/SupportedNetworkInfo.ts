import { BSCTestnet, ERC20Interface, Polygon } from "@usedapp/core";
import { Contract } from "ethers";
import {
  ANUSDLogoSVG,
  BNBLogoSVG,
  BSCScanLogoCircleLight,
  PolygonLogoSVG,
  tokenLogoSVG,
  USDTLogoSVG,
} from "../assets";

import PresaleInterface from "../contracts/artifacts/contracts/PresaleUpgradeable.sol/PresaleUpgradeable.json";
import ReferralInterface from "../contracts/artifacts/contracts/ReferralUpgradeable.sol/ReferralUpgradeable.json";
import StakingInterface from "../contracts/artifacts/contracts/StakingUpgradeable.sol/StakingUpgradeable.json";
import UniswapV2RouterInterface from "../contracts/artifacts/contracts/PresaleUpgradeable.sol/IUniswapRouter.json";

export const TokenName = "an.eth";
export const TokenSymbol = "an.eth";
export const ProjectName = "Aneth Technologies Limited";
export const TokenLogo = tokenLogoSVG;
export const ANUSDLogo = ANUSDLogoSVG;
export const DefaultReferrer = "0x49066990635F9AEA7706dD73183177a463352445";

export const PresaleEndsIn = "1 July, 2023";

export const DefaultChainId = 97;

export const AddressZero = "0x0000000000000000000000000000000000000000";

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
  [BSCTestnet.chainId]: {
    variablesContract: "0xbE5153baa3756402b08fD830E7b5F00a76E68231",
    uniswapV2RouterContract: "0xDE2Db97D54a3c3B008a097B2260633E6cA7DB1AF",
    uniswapV2RouterContractInterface: new Contract(
      "0xDE2Db97D54a3c3B008a097B2260633E6cA7DB1AF",
      UniswapV2RouterInterface?.abi
    ),
    presaleContract: "0x44F679149AE9f634Dee493bbe9375b685ac212e9",
    presaleContractInterface: new Contract(
      "0x44F679149AE9f634Dee493bbe9375b685ac212e9",
      PresaleInterface?.abi
    ),
    referralContract: "0xC736DE76a309DD0EF2DbdA9b593f30C5b97f65f7",
    referralContractInterface: new Contract(
      "0xC736DE76a309DD0EF2DbdA9b593f30C5b97f65f7",
      ReferralInterface.abi
    ),
    stakingContractAddress: "0xb2734c69156Caa3C50eD0B56E6686dCF005D1379",
    stakingContractInterface: new Contract(
      "0xb2734c69156Caa3C50eD0B56E6686dCF005D1379",
      StakingInterface?.abi
    ),
    Token: {
      ContractAddress: "0x89c701DCcC25e48566aF89cAC1e32706c5B55546",
      ContractInterface: new Contract(
        "0x89c701DCcC25e48566aF89cAC1e32706c5B55546",
        ERC20Interface
      ),
      Name: "an.eth",
      Symbol: "an.eth",
      Decimals: 18,
      Logo: TokenLogo,
    },
    ANUSD: {
      ContractAddress: "0xe6ffee89beb3bee2785eE88deD4Da74F8a082A78",
      ContractInterface: new Contract(
        "0xe6ffee89beb3bee2785eE88deD4Da74F8a082A78",
        ERC20Interface
      ),
      Name: "an.usd",
      Symbol: "an.usd",
      Decimals: 18,
      Logo: ANUSDLogo,
    },
    USDT: {
      ContractAddress: "0xbfA0e2F4b2676c62885B1033670C71cdefd975fB",
      ContractInterface: new Contract(
        "0xbfA0e2F4b2676c62885B1033670C71cdefd975fB",
        ERC20Interface
      ),
      Name: "Tether USDT",
      Symbol: "USDT",
      Decimals: 6,
      Logo: USDTLogoSVG,
    },
    Native: {
      ContractAddress: "",
      ContractInterface: "",
      Name: "Binance Smart Chain Testnet",
      Symbol: "tBNB",
      Decimals: 18,
      Logo: BNBLogoSVG,
    },
    Network: BSCTestnet,
    NetworkRPCUrl: "https://data-seed-prebsc-1-s3.binance.org:8545",
    NetworkColor: "yellow.500",
    NetworkExplorerLink: BSCTestnet.blockExplorerUrl,
    NetworkExplorerName: "BscScanTestnet",
    NetworkExplorerLogo: BSCScanLogoCircleLight,
  },
  [Polygon.chainId]: {
    variablesContract: "0x64f0F2FA59a92Df28bE30876958023A69689D88c",
    uniswapV2RouterContract: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
    uniswapV2RouterContractInterface: new Contract(
      "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
      UniswapV2RouterInterface?.abi
    ),
    presaleContract: "0x0c750b915ef0112B204f0f7E6812be292b9936A2",
    presaleContractInterface: new Contract(
      "0x0c750b915ef0112B204f0f7E6812be292b9936A2",
      PresaleInterface?.abi
    ),
    referralContract: "0x4b6610F521c33cFa6E2d055B563108650B732155",
    referralContractInterface: new Contract(
      "0x4b6610F521c33cFa6E2d055B563108650B732155",
      ReferralInterface.abi
    ),
    stakingContractAddress: "0xFcE5456E731932dF6d4D9A6Ce3782C08BD2e5Efc",
    stakingContractInterface: new Contract(
      "0xFcE5456E731932dF6d4D9A6Ce3782C08BD2e5Efc",
      StakingInterface?.abi
    ),
    Token: {
      ContractAddress: "0x89c701DCcC25e48566aF89cAC1e32706c5B55546",
      ContractInterface: new Contract(
        "0x89c701DCcC25e48566aF89cAC1e32706c5B55546",
        ERC20Interface
      ),
      Name: "an.eth",
      Symbol: "an.eth",
      Decimals: 18,
      Logo: TokenLogo,
    },
    ANUSD: {
      ContractAddress: "0xe6ffee89beb3bee2785eE88deD4Da74F8a082A78",
      ContractInterface: new Contract(
        "0xe6ffee89beb3bee2785eE88deD4Da74F8a082A78",
        ERC20Interface
      ),
      Name: "an.usd",
      Symbol: "an.usd",
      Decimals: 18,
      Logo: ANUSDLogo,
    },
    USDT: {
      ContractAddress: "0xbfA0e2F4b2676c62885B1033670C71cdefd975fB",
      ContractInterface: new Contract(
        "0xbfA0e2F4b2676c62885B1033670C71cdefd975fB",
        ERC20Interface
      ),
      Name: "Tether USDT",
      Symbol: "USDT",
      Decimals: 6,
      Logo: USDTLogoSVG,
    },
    Native: {
      ContractAddress: "",
      ContractInterface: "",
      Name: "Polygon",
      Symbol: "MATIC",
      Decimals: 18,
      Logo: PolygonLogoSVG,
    },
    Network: BSCTestnet,
    NetworkRPCUrl: "https://rpc-mainnet.matic.quiknode.pro",
    NetworkColor: "purple",
    NetworkExplorerLink: Polygon.blockExplorerUrl,
    NetworkExplorerName: "PolygonScan",
    NetworkExplorerLogo: PolygonLogoSVG,
  },
};
