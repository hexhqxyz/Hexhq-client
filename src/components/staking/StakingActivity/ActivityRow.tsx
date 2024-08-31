import { CalendarDaysIcon, MoveUpRight, WalletCardsIcon } from "lucide-react";
import React from "react";
import { format } from "date-fns";
import { ethers } from "ethers";
import { formatNumber, shortenString } from "@/lib/utils";
import Link from "next/link";
import { BLOCK_EXPLORER } from "@/lib/constants";

type Activity = {
  type: "Staked" | "Withdrawn" | "RewardsClaimed";
  user: string;
  amount: string;
  timestamp: number; // Assuming timestamp is in ISO format
  transactionHash: string;
  blockNumber: string;
};

type Props = {
  activity: Activity;
};
export const getCurrency = (type: string) => {
  switch (type) {
    case "Staked":
      return "ATX";
    case "Withdrawn":
      return "ATX";
    case "RewardsClaimed":
      return "dUSD";
    default:
      return "ATX";
  }
};

export const getActivityIcon = (type: string) => {
    switch (type) {
      case "Staked":
        return <WalletCardsIcon className="w-5 h-5 text-green-500" />;
      case "Withdrawn":
        return <WalletCardsIcon className="w-5 h-5 text-red-500" />;
      case "RewardsClaimed":
        return <WalletCardsIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <WalletCardsIcon className="w-5 h-5 text-muted-foreground" />;
    }
  };

const ActivityRow = ({ activity }: Props) => {
  if (!activity) return <>nothing...</>;
//   console.log("activity:", activity);
  const formattedTimestamp = format(
    new Date(activity.timestamp * 1000 || ""),
    "do MMM yyyy, h:mm a"
  );
  const formattedAmount = activity.amount
    ? ethers.formatUnits(activity.amount, 18)
    : "0";
  const etherscanLink = `${BLOCK_EXPLORER}/tx/${activity.transactionHash}`;


  return (
    <div className="px-4 py-2 cursor-pointer hover:bg-secondary rounded-md">
      <div className="flex items-center">
        {getActivityIcon(activity.type)}
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{activity.type}</p>
          <Link
            onClick={(e) => {
              e.stopPropagation();
            }}
            href={etherscanLink}
            target="_blank"
            className="text-sm text-muted-foreground flex gap-x-1 items-center"
          >
            {shortenString(activity.transactionHash)}{" "}
            <MoveUpRight className="w-3 h-3 text-muted-foreground" />{" "}
          </Link>
        </div>
        <div className="ml-auto text-right">
          <p className="font-medium">
            {formatNumber(formattedAmount)} {getCurrency(activity.type)}
          </p>
          <p className="text-sm text-muted-foreground flex gap-x-1 items-center">
            {" "}
            <CalendarDaysIcon className="w-3 h-3 text-muted-foreground" />{" "}
            {formattedTimestamp}{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityRow;
