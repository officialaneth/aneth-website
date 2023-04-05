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
    presaleContract: "0xf7B74347b4dF59589d14BFB4cb0d2c547f3F79E5",
    presaleContractInterface: new Contract(
      "0xf7B74347b4dF59589d14BFB4cb0d2c547f3F79E5",
      PresaleInterface?.abi
    ),
    stakingContractAddress: "0xe6f3eF32E28DC071e33c36be943e824A347F2f33",
    stakingContractInterface: new Contract(
      "0xe6f3eF32E28DC071e33c36be943e824A347F2f33",
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
