import { ChakraProvider, ColorModeScript, theme } from "@chakra-ui/react";
import { BSCTestnet, Config, DAppProvider, Polygon } from "@usedapp/core";
import { WalletConnectConnector } from "@usedapp/wallet-connect-connector";
import { getDefaultProvider } from "ethers";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./navigation/Routes";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";

const dappConfig: Config = {
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
  networks: [Polygon, BSCTestnet],
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

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <DAppProvider config={dappConfig}>
      <ChakraProvider theme={theme}>
        <ColorModeScript />
        <RouterProvider router={router}></RouterProvider>
      </ChakraProvider>
    </DAppProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
