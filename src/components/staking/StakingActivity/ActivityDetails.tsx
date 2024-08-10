import React from "react";
import { format } from "date-fns";
import { ethers } from "ethers";
import { CalendarDaysIcon, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

import { buttonVariants } from "@/components/ui/button";
import { getCurrency } from "./ActivityRow";

import { cn } from "@/lib/utils";
import { BLOCK_EXPLORER } from "@/lib/constants";

type Activity = {
  type: "Staked" | "Withdrawn" | "RewardsClaimed";
  user: string;
  amount: string;
  timestamp: number;
  transactionHash: string;
  blockNumber: string;
};

type Props = {
  activity: Activity;
};

const ActivityDetails = ({ activity }: Props) => {
  const formattedTimestamp = format(
    new Date(activity.timestamp * 1000 || ""),
    "PPpp"
  );
  const formattedAmount = activity.amount
    ? ethers.formatUnits(activity.amount, 18)
    : "0";

  const etherscanLink = `${BLOCK_EXPLORER}/tx/${activity.transactionHash}`;
  const etherscanBlockLink = `${BLOCK_EXPLORER}/block/${activity.blockNumber}`;

  return (
    <div className="">
      <div className="mb-2">
        <motion.p
          className="text-neutral-600 dark:text-neutral-400"
        >
          Here are the detailed information about the transaction. You can view
          more details on Etherscan by clicking the button below.
        </motion.p>
      </div>

      <div className="flex justify-between items-start">
        <div className="">
          <p className="font-medium">
            {formattedAmount} {getCurrency(activity.type)}
          </p>
          <p className="text-sm text-muted-foreground flex gap-x-1 items-center">
            <CalendarDaysIcon className="w-3 h-3 text-muted-foreground" />{" "}
            {formattedTimestamp}
          </p>
        </div>

        <motion.a
          href={etherscanLink}
          target="_blank"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          View on Etherscan <ExternalLink className="ml-2 w-4 h-4" />
        </motion.a>
      </div>

      <div className="my-4">
        <div className="flex items-center justify-between">
          <div>
            <motion.a
              href={etherscanBlockLink}
              target="_blank"
              className={cn(buttonVariants({ variant: "link" }), "p-0")}
            >
              #{activity.blockNumber} <ExternalLink className="ml-2 w-4 h-4" />
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
