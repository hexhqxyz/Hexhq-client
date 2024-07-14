"use client";

import {
  useWeb3Modal,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { useIsClient } from "usehooks-ts";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

export default function ConnectButton() {
  const { isConnected, chainId } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();
  const isClient = useIsClient();

  return (
    <div>
      {isClient &&
        (isConnected ? (
          <div className="flex gap-x-2 items-center">
            {chainId !== 1337 && (
              <Button variant={"destructive"} size={"sm"} className="items-center gap-x-2" onClick={() => open({ view: "Networks" })}>Unsupported Network <ChevronDown className="w-4 h-4" /></Button>
            )}
            <w3m-account-button />
          </div>
        ) : (
          <w3m-connect-button />
        ))}
    </div>
  );
}
