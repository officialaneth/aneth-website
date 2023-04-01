import { BSCTestnet, ERC20Interface } from "@usedapp/core";
import { Contract } from "ethers";
import {
  BNBLogoSVG,
  BSCScanLogoCircleLight,
  tokenLogoSVG,
  USDTLogoSVG,
} from "../assets";

import PresaleInterface from "../contracts/artifacts/contracts/PresaleUpgradeable.sol/PresaleUpgradeable.json";
import StakingInterface from "../contracts/artifacts/contracts/StakingUpgradeable.sol/StakingUpgradeable.json";
import UniswapV2RouterInterface from "../contracts/artifacts/contracts/PresaleUpgradeable.sol/IUniswapRouter.json";

export const TokenName = "an.eth";
export const TokenSymbol = "an.eth";
export const ProjectName = "Aneth Technologies Limited";
export const TokenLogo = tokenLogoSVG;
export const DefaultReferrer = "0x49066990635F9AEA7706dD73183177a463352445";

export const StakingInfo = {
  rewardRate: 100,
  duration: 10,
  minValue: 0.001,
  packages: [0],
};

export const website = window.location.host;

export const DeepLinks = {
  trustwallet: `https://link.trustwallet.com/open_url?coin_id=966&url=${website}`,
  metamask: `https://metamask.app.link/dapp/${website}`,
  coinbase: `https://go.cb-w.com/dapp?cb_url=${website}`,
};

export const useSupportedNetworkInfo = {
  [BSCTestnet.chainId]: {
    variablesContract: "0xa0144428Fdb582b7681cb3f9e246bab4753a6AD0",
    uniswapV2RouterContract: "0xDE2Db97D54a3c3B008a097B2260633E6cA7DB1AF",
    uniswapV2RouterContractInterface: new Contract(
      "0xDE2Db97D54a3c3B008a097B2260633E6cA7DB1AF",
      UniswapV2RouterInterface?.abi
    ),
    presaleContract: "0x0c750b915ef0112B204f0f7E6812be292b9936A2",
    presaleContractInterface: new Contract(
      "0x0c750b915ef0112B204f0f7E6812be292b9936A2",
      PresaleInterface?.abi
    ),
    stakingContractAddress: "0x08eFdc513580DD7C7183916c833e98ff143dF43c",
    stakingContractInterface: new Contract(
      "0x08eFdc513580DD7C7183916c833e98ff143dF43c",
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
      Name: "ANUSD",
      Symbol: "ANUSD",
      Decimals: 18,
      Logo: TokenLogo,
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
};
