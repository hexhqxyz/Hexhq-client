import React from "react";
import ThemeSwitcher from "../ThemeSwitcher";
import ConnectButton from "../ConnectWallet";
import { Heading, headingClasses } from "../ui/Typography";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { Github } from "lucide-react";

type Props = {};

const links = [
  {
    href: "/staking",
    label: "Staking",
  },
  {
    href: "/lending",
    label: "Lending",
  },
  {
    href: "/amm",
    label: "Amm",
  },
  {
    href: "/yield-farming",
    label: "Yield farming",
  },
  {
    href: "/faucet",
    label: "Faucet",
  },
];

const Navbar = (props: Props) => {
  return (
    <div className="flex justify-between items-center">
      <Link className={cn(headingClasses["h3"])} href={"/"}>OmniDeFi</Link>
      <div className="flex items-center gap-x-2">
        {links?.map((item, index) => (
          <Link
            key={index}
            className={cn(buttonVariants({ variant: "outline" }))}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-x-2">
        <ConnectButton />
        <Link
          href={"https://github.com/SachinCoder1/Omni-DeFi"}
          target="_blank"
        >
          <Github className="w-5 h-5" />
        </Link>
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Navbar;
