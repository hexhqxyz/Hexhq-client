import React from "react";
import ThemeSwitcher from "../ThemeSwitcher";
import ConnectButton from "../ConnectWallet";
import { headingClasses } from "../ui/Typography";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { Github, HomeIcon } from "lucide-react";

type Props = {};

export const links = [
  {
    href: "/staking",
    label: "Staking",
    icon: <HomeIcon className="text-muted-foreground w-5 h-5" />,
  },
  {
    href: "/lending",
    label: "Lending",
    icon: <HomeIcon className="text-muted-foreground w-5 h-5" />,
  },
  {
    href: "/amm",
    label: "Amm",
    icon: <HomeIcon className="text-muted-foreground w-5 h-5" />,
  },
  {
    href: "/yield-farming",
    label: "Yield farming",
    icon: <HomeIcon className="text-muted-foreground w-5 h-5" />,
  },
  {
    href: "/faucet",
    label: "Faucet",
    icon: <HomeIcon className="text-muted-foreground w-5 h-5" />,
  },
];

const Navbar = (props: Props) => {
  return (
    <div className="flex justify-between items-center h-full">
      <Link className={cn(headingClasses["h3"])} href={"/"}>
        OmniDeFi
      </Link>
      <div className="lg:flex items-center gap-x-2 hidden">
        {links?.map((item, index) => (
          <Link
            key={index}
            className={cn(buttonVariants({ variant: "link", size: "sm" }))}
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
          className="md:block hidden"
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
