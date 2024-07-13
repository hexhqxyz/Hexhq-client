"use client";

import { Button } from "@/components/ui/button";
import { useSwitchNetwork, useWeb3ModalAccount } from "@web3modal/ethers/react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const { chainId, isConnected } = useWeb3ModalAccount();
  const { switchNetwork } = useSwitchNetwork();

  const handleSwitch = () => {
    switchNetwork(1337);
  };

  if (!isConnected) {
    return <div>please connect to continue</div>;
  }

  if (chainId !== 1337) {
    return (
      <div>
        <Button onClick={() => handleSwitch()}>
          Please switch to the localhost to continue
        </Button>
      </div>
    );
  }

  return (
    <div>
      hurray!!! connected to {chainId}
      <div>{children}</div>
    </div>
  );
};

export default Layout;
