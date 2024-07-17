"use client";

import { Button } from "@/components/ui/button";
import ScreenLoading from "@/components/ui/ScreenLoading";
import { TabsNav } from "@/components/ui/TabsNav";
import useInitializeWeb3 from "@/hooks/initialize-web3";
import { useSwitchNetwork, useWeb3ModalAccount } from "@web3modal/ethers/react";
import React, { Suspense } from "react";
import { useIsClient } from "usehooks-ts";

type Props = {
  children: React.ReactNode;
};

const tabItems = [
  {
    title: "Stake",
    href: "/staking",
  },
  {
    title: "Withdraw",
    href: "/staking/withdraw",
  },
  {
    title: "Activity",
    href: "/staking/activity",
  },
];

const Layout = ({ children }: Props) => {
  return (
    <div>
      <Suspense fallback={<ScreenLoading />}>
        <div className="flex flex-col items-center min-h-[calc(100vh-86px)] justify-center">
          <div className="w-5/12 flex justify-center items-center flex-col mx-auto border rounded-md">
            <div className="border-b w-full rounded-md">
              <TabsNav items={tabItems} />
            </div>
            <div className="w-full p-2">{children}</div>
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default Layout;
