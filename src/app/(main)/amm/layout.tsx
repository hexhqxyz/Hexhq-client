"use client";

import React, { Suspense, useEffect } from "react";
import ScreenLoading from "@/components/ui/ScreenLoading";
import useInitializeAmm from "@/hooks/use-initialize-amm";
import { useAmmStore } from "@/store/amm-store";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useWeb3Store } from "@/store/signer-provider-store";

type Props = {
  children: React.ReactNode;
};

const tabItems = [
  {
    title: "Swap",
    href: "/staking",
  },
];

const Layout = ({ children }: Props) => {
  const address = useWeb3ModalAccount().address;
  const signer = useWeb3Store().signer;

  useInitializeAmm();
  const setTokenPrices = useAmmStore().setCurrentTokenPrices;

  useEffect(() => {
    if (!address || !signer) return;
    setTokenPrices();
  }, [address, signer]);

  return (
    <div>
      <Suspense fallback={<ScreenLoading />}>
        <div className="flex flex-col w-full items-center min-h-[calc(100vh-86px)] justify-center">
          <div className="w-full px-2 py-0.5 flex flex-col items-center">
            {children}
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default Layout;
