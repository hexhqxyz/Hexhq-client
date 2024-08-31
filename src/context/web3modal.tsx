"use client";

import { ALL_CHAINS } from "@/lib/networks";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WEB3MODAL_PROJECT_ID as string;

const metadata = {
  name: "Astra Defi",
  description: "Astradefi is an all in one defi platform which facilitates lending, liquidity, AMMs, Earning rewards and many more.",
  url: "https://astradefi.sachingurjar.me", // origin must match your domain & subdomain
  icons: ["/favicon.ico"],
};
// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,
  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  // rpcUrl: "...", // used for the Coinbase SDK
  // defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: ALL_CHAINS,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: false, // Optional - false as default
  // allowUnsupportedChain: false,
});

type Props = {
  children: React.ReactNode;
};

export function Web3Modal({ children }: Props) {
  return children;
}
