import { BSCTestnet, Config, Polygon } from "@usedapp/core";
import { WalletConnectConnector } from "@usedapp/wallet-connect-connector";
import { getDefaultProvider } from "ethers";

export const DappConfig: Config = {
  notifications: {
    expirationPeriod: 5000,
  },
  readOnlyChainId: Polygon.chainId,
  readOnlyUrls: {
    [BSCTestnet?.chainId]: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    [Polygon.chainId]: getDefaultProvider(
      "https://rpc.ankr.com/polygon/116f86c5aa8f660de1bcde9bccdb9bbf0e0261f3551777d1231e88d124612e8f"
    ),
  },
  networks: [BSCTestnet, Polygon],
  connectors: {
    walletConnect: new WalletConnectConnector({
      rpc: {
        97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        [Polygon.chainId]: "https://rpc.ankr.com/polygon/116f86c5aa8f660de1bcde9bccdb9bbf0e0261f3551777d1231e88d124612e8f",
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
