"use client";

import { Button } from "@/components/ui/button";
import InfoCard from "@/components/ui/InfoCard";
import ScreenLoading from "@/components/ui/ScreenLoading";
import { TabsNav } from "@/components/ui/TabsNav";
import useInitializeWeb3 from "@/hooks/initialize-web3";
import useInitializeStaking from "@/hooks/use-initialize-staking";
import { useWeb3Store } from "@/store/signer-provider-store";
import { useStakingStore } from "@/store/staking-store";
import { useSwitchNetwork, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { DollarSignIcon } from "lucide-react";
import React, { Suspense, useEffect } from "react";
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
  const {setTotalApprovedAmount,setTotalStakedAmount} = useStakingStore();
  const { address } = useWeb3ModalAccount();
  const { signer } = useWeb3Store();
  useInitializeStaking();

  useEffect(() => {
    if (!address || !signer) return;
    setTotalApprovedAmount();
    setTotalStakedAmount();
  }, [address, signer]);
  
  return (
    <div>
      <Suspense fallback={<ScreenLoading />}>
        <div className="flex flex-col w-full items-center min-h-[calc(100vh-86px)] justify-center">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 py-4 w-8/12">
            <InfoCard
              icon={
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              }
              title="Total Revenue"
              value="$45,231.89"
              subValue="+20.1% from last month"
            />
            <InfoCard
              icon={
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              }
              title="Total Revenue"
              value="$45,231.89"
              subValue="+20.1% from last month"
            />
            <InfoCard
              icon={
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              }
              title="Total Revenue"
              value="$45,231.89"
              subValue="+20.1% from last month"
            />
            <InfoCard
              icon={
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              }
              title="Total Revenue"
              value="$45,231.89"
              subValue="+20.1% from last month"
            />
          </div>
          <div className="w-8/12 flex justify-center items-center flex-col mx-auto border rounded-md">
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
