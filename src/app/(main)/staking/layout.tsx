"use client";

import React, { Suspense, useEffect } from "react";
import { Award, DollarSignIcon } from "lucide-react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import useInitializeStaking from "@/hooks/use-initialize-staking";
import { useWeb3Store } from "@/store/signer-provider-store";
import { useStakingStore } from "@/store/staking-store";
import ClaimReward from "@/components/staking/ClaimReward";
import EarnedReward from "@/components/staking/EarnedReward";
import InfoCard from "@/components/ui/InfoCard";
import ScreenLoading from "@/components/ui/ScreenLoading";
import { TabsNav } from "@/components/ui/TabsNav";
import { Heading } from "@/components/ui/Typography";
import TotalRewardEarned from "@/components/staking/TotalRewardEarned";
import { useTokenStore } from "@/store/token-store";
import { Card, CardTitle } from "@/components/ui/card";

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
    title: "Borrow",
    href: "/staking/borrow",
  },
  {
    title: "Repay",
    href: "/staking/repay",
  },
];

const Layout = ({ children }: Props) => {
  const {
    setTotalApprovedAmount,
    setTotalStakedAmount,
    setTotalBorrowedAmount,
    totalStakedAmount,
  } = useStakingStore();
  const { setAvailableStakingTokenBalance } = useTokenStore();
  const { address } = useWeb3ModalAccount();
  const { signer } = useWeb3Store();
  useInitializeStaking();

  useEffect(() => {
    if (!address || !signer) return;
    setTotalApprovedAmount();
    setTotalStakedAmount();
    setAvailableStakingTokenBalance();
    setTotalBorrowedAmount();
  }, [address, signer]);

  return (
    <div>
      <Suspense fallback={<ScreenLoading />}>
        <div className="flex flex-col w-full items-center min-h-[calc(100vh-86px)] justify-center">
          <Heading className="text-center">Staking DApp</Heading>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 py-4 w-full lg:w-11/12 px-4 lg:px-0">
            <InfoCard
              icon={
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              }
              title="Your Staked Balance"
              value={`${totalStakedAmount} DTX`}
              subValue="As of now"
            />

            <EarnedReward />
            <TotalRewardEarned />
          </div>
          <div className="flex justify-center md:justify-end w-full lg:w-11/12 lg:mb-0 mb-4 px-4 lg:px-0">
            <ClaimReward />
          </div>

          <div className="grid grid-cols-3 gap-x-4 w-11/12 mt-6">
            <div className="col-span-2">
              <Card className="bg-secondary p-2">
                <CardTitle>Supply info</CardTitle>
              </Card>
            </div>
            <div className="w-full flex justify-center items-center flex-col mx-auto border bg-background shadow-lg rounded-lg px-4 lg:px-0">
              <div className="border-b w-full rounded-md">
                <TabsNav items={tabItems} />
              </div>
              <div className="w-full px-2 py-0.5">{children}</div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default Layout;
