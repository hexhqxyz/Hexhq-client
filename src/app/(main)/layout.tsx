"use client";

import React, { Suspense } from "react";
import { useIsClient } from "usehooks-ts";
import { useSwitchNetwork, useWeb3ModalAccount } from "@web3modal/ethers/react";
import useInitializeWeb3 from "@/hooks/initialize-web3";
import { Button } from "@/components/ui/button";
import ScreenLoading from "@/components/ui/ScreenLoading";
import ResizableMain from "@/components/ResizableMain";
import { ShootingStarsAndStarsBackgroundDemo } from "@/components/landing/StarsBackground";
import { Heading } from "@/components/ui/Typography";
import ConnectButton from "@/components/ConnectWallet";
import { CompareDemo } from "@/components/landing/Compare";
import { ShootingStars } from "@/components/ui/animations/shooting-stars";
import { StarsBackground } from "@/components/ui/animations/stars-background";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const { chainId, isConnected, status } = useWeb3ModalAccount();
  const client = useIsClient();
  useInitializeWeb3();
  const { switchNetwork } = useSwitchNetwork();
  const handleSwitch = () => {
    try {
      switchNetwork(1337);
    } catch (error) {}
  };

  if (status === "reconnecting" || !client) {
    return <ScreenLoading />;
  }

  if (!isConnected) {
    return (
      <div className="w-full flex justify-center flex-col items-center p-4 space-y-4">
        <ShootingStarsAndStarsBackgroundDemo />
      </div>
    );
  }

  if (chainId && ![1337, 1, 11155111].includes(chainId)) {
    return (
      <div>
        <div className="h-[45rem] rounded-md dark:bg-neutral-900 flex flex-col items-center justify-center relative w-full">
          <Heading className="relative flex-col md:flex-row z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-clip-text dark:text-transparent dark:bg-gradient-to-b from-neutral-800 via-white to-white flex items-center gap-2 md:gap-4">
            <span>Omni</span>
            <span>DeFi</span>
          </Heading>
          <Heading className="pt-6">
            You are using unsupported network. Please change it by clicking below.
          </Heading>
          <div className="pt-6 relative z-10">
            <Button onClick={() => handleSwitch()}>
              Please switch to the localhost to continue
            </Button>
          </div>
          <ShootingStars />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Suspense fallback={<ScreenLoading />}>
        <div className="lg:block hidden">
          <ResizableMain>
            <div className="">{children}</div>
          </ResizableMain>
        </div>
        <div className="lg:hidden block">
          {/* <MySidebar /> */}
          <div className="">{children}</div>
        </div>
      </Suspense>
    </div>
  );
};

export default Layout;
