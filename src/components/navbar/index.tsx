import React from "react";
import ThemeSwitcher from "../ThemeSwitcher";
import ConnectButton from "../ConnectWallet";
import { headingClasses } from "../ui/Typography";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Github, HomeIcon } from "lucide-react";
import MobileSidebar from "../Sidebar/MobileSidebar";
import CommandMenu from "./CommandMenu";
import LaunchApp from "./LaunchApp";

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
        AstraDeFi
      </Link>
      <div className="lg:flex items-center gap-x-2 hidden">
        <CommandMenu />
      </div>
      <div className="flex items-center gap-x-1">
        <Link
          href={"https://github.com/SachinCoder1/Astra-DeFi"}
          className="md:block hidden"
          target="_blank"
        >
          <Github className="w-5 h-5" />
        </Link>
        <ThemeSwitcher />
        <div className="lg:hidden">
          <MobileSidebar />
        </div>
        <div className="md:block hidden">
          <LaunchApp />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
