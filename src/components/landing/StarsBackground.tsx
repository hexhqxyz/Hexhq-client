"use client";
import React from "react";
import { ShootingStars } from "@/components/ui/animations/shooting-stars";
import { StarsBackground } from "@/components/ui/animations/stars-background";
import { Heading } from "../ui/Typography";
import ConnectButton from "../ConnectWallet";
import { CompareDemo } from "./Compare";
export function ShootingStarsAndStarsBackgroundDemo() {
  return (
    <div className="h-[45rem] rounded-md dark:bg-neutral-900 flex flex-col items-center justify-center relative w-full">
      <Heading className="relative flex-col md:flex-row z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-clip-text dark:text-transparent dark:bg-gradient-to-b from-neutral-800 via-white to-white flex items-center gap-2 md:gap-4">
        <span>Astra</span>
        {/* <span className="text-white text-lg font-thin">x</span> */}
        <span>DeFi</span>
      </Heading>
      <Heading className="pt-6">Please connect your Wallet to continue</Heading>
      <div className="pt-6 relative z-10">
        <ConnectButton />
        </div>
        <div className="w-full flex justify-center relative z-10">
          <CompareDemo />
        </div>
      <ShootingStars />
      <StarsBackground />
    </div>
  );
}
