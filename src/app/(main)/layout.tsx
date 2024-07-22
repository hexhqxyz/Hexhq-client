"use client";

import React, { Suspense } from "react";
import { useIsClient } from "usehooks-ts";
import { useSwitchNetwork, useWeb3ModalAccount } from "@web3modal/ethers/react";
import useInitializeWeb3 from "@/hooks/initialize-web3";
import { Button } from "@/components/ui/button";
import ScreenLoading from "@/components/ui/ScreenLoading";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const { chainId, isConnected, status } = useWeb3ModalAccount();
  const client = useIsClient();
  useInitializeWeb3();
  const { switchNetwork } = useSwitchNetwork();
  const handleSwitch = () => {
    switchNetwork(1337);
  };

  if (status === "reconnecting" || !client) {
    return <ScreenLoading />;
  }

  if (!isConnected) {
    return <div>please connect to continue</div>;
  }

  if (chainId && ![1337,1,11155111].includes(chainId)) {
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
      <Suspense fallback={<ScreenLoading />}>
        <div className="">{children}</div>
      </Suspense>
    </div>
  );
};

export default Layout;
