"use client";
import Image from "next/image";
import React from "react";
import { Card, Carousel } from "../ui/animations/apple-cards-carousel";

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Get to know AstraDefi (Sneak peak).
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const data = [
  {
    category: "Staking",
    title: "Staking platform.",
    src: "/platform_screenshots/01_platform.png",
  },
  {
    category: "AMM",
    title: "Swap your tokens.",
    src: "/platform_screenshots/02_platform_trade_dark_full.png",
  },
  {
    category: "Product",
    title: "Pools analytic.",
    src: "/platform_screenshots/03_platform_amm_graphs_dark.png",
  },

  {
    category: "Pools",
    title: "Provide liquidity to the pool.",
    src: "/platform_screenshots/04_provide_liquidity_dark.png",
  },
  {
    category: "Activity",
    title: "See all of your activity.",
    src: "/platform_screenshots/05_myactivity_dark.png",
  },
  {
    category: "Rewards",
    title: "Claim reward at one click",
    src: "/platform_screenshots/06_claim_reward_dark.png",
  },
];
