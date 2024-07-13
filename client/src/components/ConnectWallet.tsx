"use client";

import { useWeb3ModalAccount } from "@web3modal/ethers/react";

export default function ConnectButton() {
  const {isConnected} = useWeb3ModalAccount();
  console.log("is connected..", isConnected)
  return (
    <> 
    {
      isConnected ? <w3m-account-button /> : <w3m-connect-button />
    }
      {/* <w3m-button /> */}
    </>
  );
}
