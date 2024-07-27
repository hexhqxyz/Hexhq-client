"use client";

import Swap from "@/components/AMM/Swap";
import { Button } from "@/components/ui/button";
import { TabsNav } from "@/components/ui/TabsNav";
import { Heading } from "@/components/ui/Typography";
import { useTokenStore } from "@/store/token-store";
import { SettingsIcon, TrendingUp } from "lucide-react";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  const { tokenDetails } = useTokenStore();
  const tabItems = [
    {
      title: "Swap",
      href: "/amm/swap",
    },
  ];

  return (
    <div className="w-96 space-y-2">
      <div className="mb-4">
        <Heading variant="h2" className="text-5xl">
          Trade
        </Heading>
        <div className="flex items-center">
          <TrendingUp className="text-blue-500 w-4 h-4" />
          <Button variant={"link"} className="text-blue-500">
            1 {tokenDetails.dtx.symbol} = 0.0002 {tokenDetails.dusd.symbol}
          </Button>
        </div>
      </div>

      <div className="w-full flex justify-between items-center mb-4">
        <div className="border-b rounded-md w-fit">
          <TabsNav linkClassName="bg-secondary shadow-none" items={tabItems} />
        </div>
        <div>
          <Button variant={"ghost"} size={"icon"}>
            <SettingsIcon className="text-muted-foreground" />
          </Button>
        </div>
      </div>
      <Swap />
    </div>
  );
};

export default Page;
