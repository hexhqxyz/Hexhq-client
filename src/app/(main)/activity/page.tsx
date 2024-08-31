"use client";

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn, shortenString } from "@/lib/utils";
import { ActivityIcon, PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { useWeb3Store } from "@/store/signer-provider-store";
import { Badge } from "@/components/ui/badge";
import LiquidityTable from "@/components/AMM/transactions/LiquidityTable";
import StakingTable from "@/components/activity/StakingActivity";

const liquidityLabels = [
  {
    label: "Swaps",
    value: "swap",
  },
  {
    label: "Add",
    value: "add",
  },
  {
    label: "Remove",
    value: "remove",
  },
];
const stakingLabels = [
  {
    label: "Staked",
    value: "stake",
  },
  {
    label: "Withdrawn",
    value: "unstake",
  },
  {
    label: "Rewards claimed",
    value: "reward",
  },
];
const loanLabels = [
  {
    label: "Loans",
    value: "loan",
  },
  {
    label: "Repayments",
    value: "repay",
  },
];
const tokenLabels = [
  {
    label: "ATX",
    value: "atx",
  },
  {
    label: "dUSD",
    value: "dusd",
  },
];

type Props = {};

type ToggleLabelType = { label: string; value: string };
type TabsContentWrapperProps = {
  toggleValue: string;
  onToggleChange: (val: string) => void;
  address: string;
  children: React.ReactNode;
  toggleLabels: ToggleLabelType[];
  extraFilters?: React.ReactNode;
};
const TabsContentWrapper = ({
  toggleValue,
  onToggleChange,
  address,
  extraFilters,
  toggleLabels,
  children,
}: TabsContentWrapperProps) => {
  return (
    <Card className="">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row w-full">
        <div className="flex flex-1 flex-wrap gap-1 px-4 items-center">
          <PageHeaderDescription className="text-base">
            Showing
          </PageHeaderDescription>
          <Badge variant={"outline"}>{toggleValue}</Badge>
          <PageHeaderDescription className="text-base">
            activity for
          </PageHeaderDescription>
          <Badge variant={"outline"}>{shortenString(address)}</Badge>
        </div>
        <div className="flex px-2 py-2 gap-x-2">
          {extraFilters}
          <ToggleGroup
            type="single"
            defaultValue={toggleLabels[0].value}
            value={toggleValue}
            onValueChange={onToggleChange}
          >
            {toggleLabels?.map((item) => (
              <ToggleGroupItem key={item.value} value={item.value}>
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardHeader>

      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
};

const Page = (props: Props) => {
  const [selectedType, setSelectedType] = useState("swap");
  const [selectedTokenFilter, setSelectedTokenFilter] = useState("transfer");
  const address = useWeb3Store().address;

  const handleTabChange = (val: string) => {
    switch (val) {
      case "liqudity":
        setSelectedType(liquidityLabels[0].value);
        break;
      case "staking":
        setSelectedType(stakingLabels[0].value);
        break;
      case "loan":
        setSelectedType(loanLabels[0].value);
        break;
      case "token":
        setSelectedType(tokenLabels[0].value);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (!selectedType) return;
    console.log("changed...", selectedType);
  }, [selectedType]);

  if (!address) return <>loading...</>;

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <div className="w-full lg:p-6 p-2">
          {/* Header section */}
          <div className="flex justify-center">
            <div className="py-2 pl-2 w-full">
              <PageHeader>
                <PageHeaderHeading>My Activity</PageHeaderHeading>
                <PageHeaderDescription>
                  Providing liquidity to a pool allows you to earn a percentage
                  of the pools traded volume as well as any extra rewards if the
                  pool is incentivized.
                </PageHeaderDescription>
                <PageActions>
                  <Link
                    href="/amm/liquidity"
                    className={cn(buttonVariants(), "rounded-[6px]")}
                  >
                    Add liquidity 🚀
                  </Link>

                  <Link
                    href="/amm/liquidity/remove"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "rounded-[6px]"
                    )}
                  >
                    Remove liquidity
                  </Link>
                </PageActions>
              </PageHeader>
            </div>
          </div>

          {/* main section */}
          <div>
            <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow md:px-8 py-2">
              <div className="flex items-center justify-between space-y-2 px-2">
                <h2 className="text-2xl font-bold tracking-tight">Activity</h2>
                <div className="md:flex items-center space-x-2 hidden">
                  <Link
                    className={cn(buttonVariants(), "gap-x-2 items-center")}
                    href={"/amm"}
                  >
                    <ActivityIcon className="w-4 h-4" /> View pools
                  </Link>
                </div>
              </div>

              <Tabs
                defaultValue="liqudity"
                className="space-y-4 mt-4"
                onValueChange={(val) => handleTabChange(val)}
              >
                <TabsList className="">
                  <TabsTrigger value="liqudity">liqudity</TabsTrigger>
                  <TabsTrigger value="staking">Staking</TabsTrigger>
                  <TabsTrigger value="loan">loans</TabsTrigger>
                </TabsList>

                <TabsContent value="liqudity">
                  <TabsContentWrapper
                    address={address}
                    onToggleChange={(val) => {
                      setSelectedType((prev) => val || prev);
                    }}
                    toggleLabels={liquidityLabels}
                    toggleValue={selectedType}
                  >
                    {selectedType === "swap" && (
                      <LiquidityTable type={"swap"} address={address} />
                    )}
                    {selectedType === "add" && (
                      <LiquidityTable type={"add"} address={address} />
                    )}
                    {selectedType === "remove" && (
                      <LiquidityTable type={"remove"} address={address} />
                    )}
                  </TabsContentWrapper>
                </TabsContent>

                <TabsContent value="staking">
                  <TabsContentWrapper
                    address={address}
                    onToggleChange={(val) => {
                      setSelectedType((prev) => val || prev);
                    }}
                    toggleLabels={stakingLabels}
                    toggleValue={selectedType}
                  >
                    {selectedType === "stake" && (
                      <StakingTable type={"stake"} address={address} />
                    )}
                    {selectedType === "unstake" && (
                      <StakingTable type={"unstake"} address={address} />
                    )}
                    {selectedType === "reward" && (
                      <StakingTable type={"reward"} address={address} />
                    )}
                  </TabsContentWrapper>
                </TabsContent>

                <TabsContent value="loan">
                  <TabsContentWrapper
                    address={address}
                    onToggleChange={(val) => {
                      setSelectedType((prev) => val || prev);
                    }}
                    toggleLabels={loanLabels}
                    toggleValue={selectedType}
                  >
                    {selectedType === "loan" && (
                      <StakingTable type={"loanTaken"} address={address} />
                    )}
                    {selectedType === "repay" && (
                      <StakingTable type={"loanRepaid"} address={address} />
                    )}
                  </TabsContentWrapper>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
