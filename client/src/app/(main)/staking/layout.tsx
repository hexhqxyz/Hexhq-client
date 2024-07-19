"use client";

import ClaimReward from "@/components/staking/ClaimReward";
import EarnedReward from "@/components/staking/EarnedReward";
import { Button } from "@/components/ui/button";
import InfoCard from "@/components/ui/InfoCard";
import ScreenLoading from "@/components/ui/ScreenLoading";
import { TabsNav } from "@/components/ui/TabsNav";
import { Heading } from "@/components/ui/Typography";
import useInitializeWeb3 from "@/hooks/initialize-web3";
import useInitializeStaking from "@/hooks/use-initialize-staking";
import { useWeb3Store } from "@/store/signer-provider-store";
import { useStakingStore } from "@/store/staking-store";
import { useSwitchNetwork, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { Award, DollarSignIcon } from "lucide-react";
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
  const { setTotalApprovedAmount, setTotalStakedAmount, totalStakedAmount } =
    useStakingStore();
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
          <Heading className="text-center">Staking DApp</Heading>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 py-4 md:w-8/12">
            <InfoCard
              icon={
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              }
              title="Your Staked Balance"
              value={`${totalStakedAmount} DTX`}
              subValue="As of now"
            />

            <EarnedReward />
            <InfoCard
              icon={<Award className="h-4 w-4 text-muted-foreground" />}
              title="Total Rewards earned"
              value="$45,231.89"
              subValue="excluding your current reward cycle"
            />
          </div>
          <div className="mb-4 flex justify-end w-8/12">
            <ClaimReward />
          </div>

          <div className="w-4/12 flex justify-center items-center flex-col mx-auto border bg-background shadow-lg rounded-lg">
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
