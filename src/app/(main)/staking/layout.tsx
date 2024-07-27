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
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InfoLabel, InfoWrapper } from "@/components/staking/InfoWrapper";
import { formatNumber } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

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
    totalStakedAmount,
    totalBorrowedAmount,
    userDetails,
    stakingDetails,
    setTotalStakedAmount,
    setTotalBorrowedAmount,
    setStakingDetails,
    setUserDetails,
  } = useStakingStore();
  const {
    tokenDetails,
    availableStakingTokenBalance,
    availableRewardTokenBalance,
    setAvailableStakingTokenBalance,
  } = useTokenStore();
  const { address } = useWeb3ModalAccount();
  const { signer } = useWeb3Store();
  useInitializeStaking();

  useEffect(() => {
    if (!address || !signer) return;
    setTotalStakedAmount();
    setAvailableStakingTokenBalance();
    setTotalBorrowedAmount();
    setStakingDetails();
    setUserDetails();
  }, [address, signer]);

  console.log("user details:", userDetails);
  console.log("staking details:", stakingDetails);

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

          <div className="grid grid-cols-5 gap-x-4 w-11/12 mt-6 reverse mb-8">
            <div className="col-span-3 space-y-8">
              <Card className="border p-4">
                <CardTitle className="text-xl">Curated for you</CardTitle>
                <div className="mt-6">
                  <div className=" space-y-2">
                    <InfoLabel
                      isSeperator={false}
                      className="flex justify-between"
                      label="How much you can borrow?"
                      value={`${userDetails.borrowLimit} dUSD`}
                    />
                    <InfoLabel
                      isSeperator={false}
                      className="flex justify-between"
                      label="Borrowed amount"
                      value={`${userDetails.borrowedAmount} dUSD`}
                    />
                    <InfoLabel
                      isSeperator={false}
                      className="flex justify-between"
                      label="Interest payable"
                      value={`${userDetails.interestPayable} dUSD`}
                    />
                    <InfoLabel
                      isSeperator={false}
                      className="flex justify-between"
                      label="Amount you need to repay"
                      value={`${userDetails.repayAmount} dUSD`}
                    />
                    <InfoLabel
                      isSeperator={false}
                      className="flex justify-between"
                      tooltip="Amount available to use in colletral"
                      label="Colletral amount"
                      value={`${totalStakedAmount} DTX`}
                    />
                  </div>
                </div>
              </Card>

              <InfoWrapper title="Stake info">
                <InfoLabel
                  tooltip="Total amount staked in the pool"
                  label="Total staked"
                  value={`${formatNumber(stakingDetails.totalStaked)} DTX`}
                />
                <InfoLabel
                  tooltip="Time when the last stake activity happened on the contract"
                  isSeperator={false}
                  label="Last updated"
                  value={`${formatDistanceToNow(stakingDetails.lastUpdated, {
                    addSuffix: true,
                    includeSeconds: true,
                  })}`}
                />
              </InfoWrapper>
              <InfoWrapper title="Borrow info">
                <InfoLabel label="Total borrow" value={`${totalBorrowedAmount} ${tokenDetails.dusd.symbol}`} />
                <InfoLabel
                  label="Interest rate (APY)"
                  value={`${stakingDetails.interestRate}%`}
                />
                <InfoLabel
                  tooltip="At a time you can borrow upto 80% of the value of your colletral amount"
                  isSeperator={false}
                  label="Collateral factor"
                  value={`${80}%`}
                />
              </InfoWrapper>
              <InfoWrapper title="dUSD info">
                <InfoLabel label="Token name" value={tokenDetails.dusd.name} />
                <InfoLabel
                  label="Total Symbol"
                  value={tokenDetails.dusd.symbol}
                />
                <InfoLabel
                  label="Total supply"
                  value={formatNumber(tokenDetails.dusd.totalSupply)}
                />
                <InfoLabel
                  label="Your balance"
                  value={`${formatNumber(availableRewardTokenBalance)} ${
                    tokenDetails.dusd.symbol
                  }`}
                  isSeperator={false}
                />
              </InfoWrapper>
              <InfoWrapper title="Staking token info">
                <InfoLabel label="Token name" value={tokenDetails.dtx.name} />
                <InfoLabel
                  label="Total Symbol"
                  value={tokenDetails.dtx.symbol}
                />
                <InfoLabel
                  label="Total supply"
                  value={formatNumber(tokenDetails.dtx.totalSupply)}
                />
                <InfoLabel
                  label="Your balance"
                  value={`${formatNumber(availableStakingTokenBalance)} ${
                    tokenDetails.dtx.symbol
                  }`}
                  isSeperator={false}
                />
              </InfoWrapper>
            </div>
            <div className="w-full h-fit flex col-span-2 justify-center items-center flex-col mx-auto border bg-background shadow-lg rounded-lg px-4 lg:px-0 sticky top-4">
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
