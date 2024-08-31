import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "../ui/animations/Spotlight";
import { PageActions } from "../page-header";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { FlipWords } from "../ui/animations/flip-words";

export function SpotlightPreview() {
  const words = ["Invest", "Borrow", "Repay", "Stake", "Pools", "AMM"];
  return (
    <div className="lg:h-[40rem] w-full rounded-md flex md:items-center md:justify-center dark:bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-20 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text dark:text-transparent dark:bg-gradient-to-b dark:from-neutral-50 dark:to-neutral-400 dark:bg-opacity-50">
          AstraDeFi <br /> Swap, Earn, <FlipWords words={words} />
        </h1>
        <p className="mt-4 font-normal text-base dark:text-neutral-300 max-w-lg text-center mx-auto">
          Swap, earn, and build on the leading decentralized finance dapp. Stake
          in ATX and earn dUSD
        </p>

        <PageActions className="flex justify-center w-full">
          <Link
            href="/staking"
            className={cn(buttonVariants(), "rounded-[6px]")}
          >
            Get started 🚀
          </Link>
          <Link
            href="/staking"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-[6px]"
            )}
          >
            Launch app
          </Link>
        </PageActions>
      </div>
    </div>
  );
}
