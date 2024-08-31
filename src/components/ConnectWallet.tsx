"use client";

import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useIsClient } from "usehooks-ts";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SUPPORTED_CHAINS } from "@/lib/constants";

type ConnectButtonProps = {
  isMobile?:boolean;
}
export default function ConnectButton({isMobile}: ConnectButtonProps) {
  const { isConnected, chainId } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();
  const isClient = useIsClient();

  if (!isClient) return null;

  if (!isConnected) {
    return <w3m-connect-button />;
  }

  return (
    <div>
      <div className="flex gap-x-2 items-center">
        {chainId && !SUPPORTED_CHAINS.includes(chainId) && (
          <Button
            variant={"destructive"}
            size={"sm"}
            className="items-center gap-x-2"
            onClick={() => open({ view: "Networks" })}
          >
            Unsupported Network <ChevronDown className="w-4 h-4" />
          </Button>
        )}
        <div className={cn(isMobile ? "" : "md:block hidden")}>
          <w3m-account-button />
        </div>
      </div>
    </div>
  );
}
