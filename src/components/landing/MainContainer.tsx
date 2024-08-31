"use client";
import React from "react";
import Image from "next/image";
import { ContainerScroll } from "../ui/animations/container-scroll-animation";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Astra DeFi
              </span>
            </h1>
          </>
        }
      >
        <Image
          src={`/platform_screenshots/01_platform.png`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top dark:block hidden"
          draggable={false}
        />
        <Image
          src={`/platform_screenshots/02_platform_trade.png`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top dark:hidden block"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
