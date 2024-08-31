import React from "react";
import { Vortex } from "../ui/animations/vortex";
import Link from "next/link";
import Image from "next/image";

type PartnerProps = {
  src: string;
  text: string;
  link: string;
};
const PartnerCard = ({ src, text, link }: PartnerProps) => {
  return (
    <Link
      target="_blank"
      href={link}
      className="flex items-center gap-x-4 p-2 rounded-lg bg-neutral-900 text-white w-max"
    >
      <Image src={src} width={30} height={30} alt={text} />
      {text}
    </Link>
  );
};

export function ProudlyUsed() {
  return (
    <div>
      <div className="w-[calc(100%-4rem)] mx-auto rounded-md  h-[30rem] overflow-hidden">
        <Vortex
          backgroundColor="black"
          className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
        >
          <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
            This DeFi is Powered By
          </h2>
          <div className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2 items-center justify-center gap-4 my-4">
            <PartnerCard
              link="https://mode.network"
              src="/partners/mode_logo.png"
              text="Mode"
            />
            <PartnerCard
              link="https://base.org"
              src="/partners/base_logo.png"
              text="Base"
            />
            <PartnerCard
              link="https://goldsky.com"
              src="/partners/goldsky_logo.png"
              text="Goldsky"
            />
            <PartnerCard
              link="https://optimism.io"
              src="/partners/op_logo.png"
              text="Optimism"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <Link
              href={"/staking"}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]"
            >
              Launch app
            </Link>
            <button className="px-4 py-2  text-white ">Learn more</button>
          </div>
        </Vortex>
      </div>
    </div>
  );
}
