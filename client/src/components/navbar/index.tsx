import React from "react";
import ThemeSwitcher from "../ThemeSwitcher";
import ConnectButton from "../ConnectWallet";
import { Heading } from "../ui/Typography";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <div className="flex justify-between items-center">
      <Heading variant="h3">OmniDeFi</Heading>
      <div className="flex items-center gap-x-2">
        <Link className={cn(buttonVariants({variant: "outline"}))} href={"/staking"}>Staking</Link>
        <Link className={cn(buttonVariants({variant: "outline"}))} href={"/staking"}>Lending</Link>
        <Link className={cn(buttonVariants({variant: "outline"}))} href={"/staking"}>AMM</Link>
        <Link className={cn(buttonVariants({variant: "outline"}))} href={"/staking"}>Yield Farming</Link>
      </div>
      <div className="flex items-center gap-x-2">
        <ThemeSwitcher />
        <ConnectButton />
      </div>
    </div>
  );
};

export default Navbar;
