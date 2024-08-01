import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "../ui/animations/Spotlight";
import { PageActions } from "../page-header";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export function SpotlightPreview() {
  return (
    <div className="lg:h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-20 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          OmniDeFi <br /> Swap, Earn, Invest.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Swap, earn, and build on the leading decentralized finance dapp. Stake
          in DTX and earn dUSD
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
