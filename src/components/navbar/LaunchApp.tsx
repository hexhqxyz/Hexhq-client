'use client'

import React from "react";
import { buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {};

const LaunchApp = (props: Props) => {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <Link
      href={"/amm/swap"}
      className={cn(buttonVariants({ variant: "invert" }), "!rounded-3xl")}
    >
      Launch app
    </Link>
  );
};

export default LaunchApp;
