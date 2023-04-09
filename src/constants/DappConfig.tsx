import { BSCTestnet, Config, Polygon } from "@usedapp/core";
import { WalletConnectConnector } from "@usedapp/wallet-connect-connector";
import { getDefaultProvider } from "ethers";

export const DappConfig: Config = {
  notifications: {
    expirationPeriod: 5000,
  },
  readOnlyChainId: BSCTestnet?.chainId,
  readOnlyUrls: {
    [BSCTestnet?.chainId]: getDefaultProvider(
      "https://data-seed-prebsc-1-s1.binance.org:8545/"
    ),
    [Polygon.chainId]: "https://polygon-rpc.com",
  },
  networks: [BSCTestnet],
  connectors: {
    walletConnect: new WalletConnectConnector({
      rpc: {
        97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        [Polygon.chainId]: "https://polygon-rpc.com",
      },
      qrcodeModalOptions: {
        desktopLinks: [
          "metamask",
          "ledger",
          "tokenary",
          "wallet",
          "wallet 3",
          "secuX",
          "ambire",
          "wallet3",
          "apolloX",
          "zerion",
          "sequence",
          "punkWallet",
          "kryptoGO",
          "nft",
          "riceWallet",
          "vision",
          "keyring",
        ],
        mobileLinks: ["metamask", "trust"],
      },
    }),
  },
  refresh: "everyBlock",
};
