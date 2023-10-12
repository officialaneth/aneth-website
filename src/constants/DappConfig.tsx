import { BSCTestnet, Config, Polygon } from '@usedapp/core';
import { WalletConnectConnector } from '@usedapp/wallet-connect-connector';
import { WalletConnectV2Connector } from '@usedapp/wallet-connect-v2-connector';
import { getDefaultProvider } from 'ethers';

// require("dotenv").config();

// if (!process.env.REACT_APP_WALLETCONNECT_PROJECT_ID) {
//   throw new Error('WalletConnect project id is not defined');
// }

export const DappConfig: Config = {
  notifications: {
    expirationPeriod: 5000,
  },
  readOnlyChainId: Polygon.chainId,
  readOnlyUrls: {
    [BSCTestnet?.chainId]: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    [Polygon.chainId]: getDefaultProvider(
      'https://polygon-rpc.com'
    ),
  },
  networks: [BSCTestnet, Polygon],
  connectors: {
    walletConnect: new WalletConnectConnector({
      rpc: {
        97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        [Polygon.chainId]: 'https://polygon-rpc.com',
      },
      qrcodeModalOptions: {
        desktopLinks: [
          'metamask',
          'ledger',
          'tokenary',
          'wallet',
          'wallet 3',
          'secuX',
          'ambire',
          'wallet3',
          'apolloX',
          'zerion',
          'sequence',
          'punkWallet',
          'kryptoGO',
          'nft',
          'riceWallet',
          'vision',
          'keyring',
        ],
        mobileLinks: ['metamask', 'trust'],
      },
    }),
    walletConnectV2: new WalletConnectV2Connector({
      projectId: "8bce980d5111c224d378dad1864c20af",
      chains: [Polygon],
      rpcMap: {
        [BSCTestnet.chainId]: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        [Polygon.chainId]: 'https://polygon-mainnet.public.blastapi.io',
      },
    }),
  },
  refresh: 'everyBlock',
};
