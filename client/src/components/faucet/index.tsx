"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";

import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useWeb3Store } from "@/store/signer-provider-store";

const USDTAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const USDTAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address addr) view returns (uint)",
  "function transfer(address to, uint amount)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

type Props = {};

const Faucet = (props: Props) => {
    const {contract,} = useWeb3Store();
  const [loading, setLoading] = useState(false);
  const { address } = useWeb3ModalAccount();

  const handleFaucetClick = async () => {
    if (!contract) return;
    setLoading(true);
    const USDTBalance = await contract.balanceOf(address);
    console.log("usdt balance:", USDTBalance)
    console.log(formatUnits(USDTBalance, 18));
    setLoading(false);
  };
  return (
    <div> 
      <Button
        className="w-full"
        onClick={handleFaucetClick}
        disabled={loading}
        loading={loading}
      >
        Send Me DTX
      </Button>
    </div>
  );
};

export default Faucet;
