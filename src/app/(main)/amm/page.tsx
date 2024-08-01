import AMM from "@/components/AMM";
import PoolInfo from "@/components/AMM/main/PoolInfo";
import AmmTransactions from "@/components/AMM/transactions";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActivityIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <div className="flex justify-center">
        <div className="py-2 pl-2 w-full">
          <PageHeader>
            <PageHeaderHeading className="hidden md:block">
              Explore pools
            </PageHeaderHeading>
            <PageHeaderHeading className="md:hidden">
              Examples
            </PageHeaderHeading>
            <PageHeaderDescription>
              Providing liquidity to a pool allows you to earn a percentage of
              the pools traded volume as well as any extra rewards if the pool
              is incentivized.
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

      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow md:px-8 py-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <div className="flex items-center space-x-2">
           <Link className={cn(buttonVariants(), "gap-x-2 items-center")} href={"#amm-transactions"}>
           <ActivityIcon className="w-4 h-4" /> View transactions
           </Link>
          </div>
        </div>
        <div className="w-full flex flex-col items-center">
          <PoolInfo />
          <div className="mt-6 w-full">
            <AMM />
          </div>
          <div className="mt-5 w-full">
            <AmmTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
