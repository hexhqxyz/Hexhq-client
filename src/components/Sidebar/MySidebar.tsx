import { cn } from "@/lib/utils";
import {
  ActivityIcon,
  ArrowDownUpIcon,
  BanknoteIcon,
  CircleDollarSign,
  CurrencyIcon,
  GanttChart,
  HandCoinsIcon,
  Home,
  HomeIcon,
  PlaneTakeoff,
  PlaneTakeoffIcon,
  SquareMousePointer,
  SquareMousePointerIcon,
  View,
  ViewIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import React, { Fragment } from "react";
import { DrawerClose } from "../ui/drawer";
import { Button } from "../ui/button";
import { links } from "@/lib/links";

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
export const MenuLink = ({
  href,
  icon,
  label,
  subLabel,
  subLabelColor = "green",
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

type MySidebarProps = {};
const MySidebar = (props: MySidebarProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* <div className="flex items-center justify-center h-14 border-b pb-4">
        <div>Tokens - ATX and dUSD</div>
      </div> */}
      {/* <DrawerClose>
        <Button variant="ghost" size={"sm"}>
          <XIcon className="w-5 h-5" />
        </Button>
      </DrawerClose> */}

      <div className="overflow-y-auto overflow-x-hidden flex-grow">
        <ul className="flex flex-col space-y-1">
          {links.map((item, index) => (
            <Fragment key={index}>
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
                    <item.Icon className="text-muted-foreground w-5 h-5" /> || (
                      <HomeIcon className="text-muted-foreground h-5 w-5" />
                    )
                  }
                  label={item.label}
                  subLabel={item.subLabel}
                  // subLabelColor={(item?.subLabelColor as any) || "green"}
                />
              ))}
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MySidebar;
