import { Chain } from "@usedapp/core";

export const MyVeeChain: Chain = {
  chainId: 7878,
  chainName: "MyVee",
  isTestChain: false,
  isLocalChain: false,
  multicallAddress: "0x014060FA292b4e59976D296d869bCA5feF0429c1",
  getExplorerAddressLink: (address: string) =>
    `https://www.myveescan.com/address/${address}`,
  getExplorerTransactionLink: (transactionHash: string) =>
    `https://www.myveescan.com/tx/${transactionHash}`,
  // Optional parameters:
  rpcUrl: "https://rpc.myveescan.com",
  blockExplorerUrl: "https://www.myveescan.com",
  nativeCurrency: {
    name: "MyVee",
    symbol: "MYVEE",
    decimals: 18,
  },
};
