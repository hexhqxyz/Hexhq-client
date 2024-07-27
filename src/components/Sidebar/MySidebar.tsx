import { cn } from "@/lib/utils";
import { ArrowDownUpIcon, BanknoteIcon, CircleDollarSign, CurrencyIcon, GanttChart, HandCoinsIcon, Home, HomeIcon, PlaneTakeoff, PlaneTakeoffIcon, SquareMousePointer, SquareMousePointerIcon, View, ViewIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export const links = [
  {
    title: "Faucet",
    subLinks: [
      {
        href: "/faucet",
        label: "Faucet",
        icon: <CircleDollarSign className="text-muted-foreground w-5 h-5" />,
      },
    ],
  },
  {
    title: "Staking",
    subLinks: [
      {
        label: "Stake",
        href: "/staking",
        icon: <PlaneTakeoffIcon className="text-muted-foreground w-5 h-5" />,
      },
      {
        label: "Withdraw",
        href: "/staking/withdraw",
        icon: <BanknoteIcon className="text-muted-foreground w-5 h-5" />,
      },
      {
        label: "Borrow",
        href: "/staking/borrow",
        icon: <SquareMousePointerIcon className="text-muted-foreground w-5 h-5" />,
      },
      {
        label: "Repay",
        href: "/staking/repay",
        icon: <HandCoinsIcon className="text-muted-foreground w-5 h-5" />,
      },
      {
        label: "Activity",
        href: "/staking/activity",
        icon: <GanttChart className="text-muted-foreground w-5 h-5" />,
      },
    ],
  },
 
  {
    title: "AMM (Swap)",
    subLinks: [
      {
        href: "/amm/swap",
        label: "Swap",
        icon: <ArrowDownUpIcon className="text-muted-foreground w-5 h-5" />,
      },
      {
        href: "/amm/liquidity",
        label: "Provide liquidity",
        icon: <HandCoinsIcon className="text-muted-foreground w-5 h-5" />,
      },
      {
        href: "/amm/tokens",
        label: "Explore",
        icon: <ViewIcon className="text-muted-foreground w-5 h-5" />,
      },
    ],
  },
];

type Props = {};

const subLabelColors = {
  blue: "text-indigo-500 bg-indigo-50",
  green: "text-green-500 bg-green-50",
};

type MenuLinkProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  subLabel?: string;
  subLabelColor?: keyof typeof subLabelColors;
};
const MenuLink = ({
  href,
  icon,
  label,
  subLabel,
  subLabelColor = "blue",
}: MenuLinkProps) => {
  return (
    <Link
      href={href}
      className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-secondary border-l-4 border-transparent hover:border-primary pr-6"
    >
      <span className="inline-flex justify-center items-center ml-4">
        {icon}
      </span>
      <span className="ml-2 text-sm tracking-wide truncate">{label}</span>
      {subLabel && (
        <span
          className={cn(
            "px-2 py-0.5 ml-auto text-xs font-medium tracking-wide rounded-full",
            subLabelColors[subLabelColor]
          )}
        >
          {subLabel}
        </span>
      )}
    </Link>
  );
};

const MySidebar = (props: Props) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center h-14 border-b">
        <div>Tokens - DTX and dUSD</div>
      </div>
      <div className="overflow-y-auto overflow-x-hidden flex-grow">
        <ul className="flex flex-col py-4 space-y-1">
          {links.map((item, index) => (
            <>
              <li className="px-5">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-light tracking-wide text-muted-foreground">
                    {item.title}
                  </div>
                </div>
              </li>
              {item.subLinks?.map((item, index) => (
                <MenuLink
                  key={index}
                  href={item.href}
                  icon={
                    item.icon || (
                      <HomeIcon className="text-muted-foreground h-5 w-5" />
                    )
                  }
                  label={item.label}
                  //   subLabel="1.2k"
                />
              ))}
            </>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MySidebar;
