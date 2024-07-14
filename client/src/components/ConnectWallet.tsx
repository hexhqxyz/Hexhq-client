"use client";

import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useIsClient } from "usehooks-ts";

export default function ConnectButton() {
  const { isConnected } = useWeb3ModalAccount();
  const isClient = useIsClient();

  return (
    <div>
      {isClient &&
        (isConnected ? <w3m-account-button /> : <w3m-connect-button />)}
    </div>
  );
}
