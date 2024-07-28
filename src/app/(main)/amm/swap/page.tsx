"use client";

import Swap from "@/components/AMM/Swap";
import { Button } from "@/components/ui/button";
import { TabsNav } from "@/components/ui/TabsNav";
import { Heading } from "@/components/ui/Typography";
import { formatNumber, formatNumberSmall } from "@/lib/utils";
import { useAmmStore } from "@/store/amm-store";
import { useTokenStore } from "@/store/token-store";
import { GitCommitVertical, SettingsIcon, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import InfoCard from "@/components/ui/InfoCard";
import { Badge } from "@/components/ui/badge";

type Props = {};

const Page = (props: Props) => {
  const [toggle, setToggle] = useState(false);
  const tokenDetails = useTokenStore().tokenDetails;
  const { priceToken1InToken2, priceToken2InToken1 } = useAmmStore();
  const tabItems = [
    {
      title: "Swap",
      href: "/amm/swap",
    },
  ];

  return (
    <div className="w-fit space-y-2">
      <div className="mb-4">
        <Heading variant="h2" className="text-5xl">
          Trade
        </Heading>
        <div className="flex items-center">
          <TrendingUp className="text-blue-500 w-4 h-4" />
          <Button
            onClick={() => setToggle(!toggle)}
            variant={"link"}
            className="text-blue-500 flex-col"
          >
            {toggle ? (
              <p>1 DTX = {formatNumberSmall(priceToken1InToken2)} dUSD</p>
            ) : (
              <p>1 dUSD = {formatNumberSmall(priceToken2InToken1)} DTX</p>
            )}
          </Button>
        </div>
      </div>

      <div className="w-full flex justify-between items-center mb-4">
        <div className="border-b rounded-md w-fit">
          <TabsNav linkClassName="bg-secondary shadow-none" items={tabItems} />
        </div>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <SettingsIcon className="text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Settings</h4>
                  <p className="text-sm text-muted-foreground">
                    Adjust to your personal preferences.
                  </p>
                </div>
                <div className="grid gap-2">
                  <InfoCard
                    title="Slippage"
                    icon={<GitCommitVertical />}
                    value={
                      <p className="flex items-center gap-x-2">
                        5%
                        <Badge variant="secondary">Auto</Badge>
                      </p>
                    }
                    subValue="of the amount"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Swap />
    </div>
  );
};

export default Page;
