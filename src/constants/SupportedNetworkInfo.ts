import { BSCTestnet, ERC20Interface } from "@usedapp/core";
import { Contract } from "ethers";
import {
  BNBLogoSVG,
  BSCScanLogoCircleLight,
  tokenLogoSVG,
  USDTLogoSVG,
} from "../assets";
import { StakingInterface } from "../contracts";

export const TokenName = "an.eth";
export const TokenSymbol = "ANETH";
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
    stakingContractAddress: "0x08eFdc513580DD7C7183916c833e98ff143dF43c",
    stakingContractInterface: new Contract(
      "0x08eFdc513580DD7C7183916c833e98ff143dF43c",
      StakingInterface?.abi
    ),
    ["USDT"]: {
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
    ["Native"]: {
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
