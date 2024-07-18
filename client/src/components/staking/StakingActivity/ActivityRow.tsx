import { WalletCardsIcon } from "lucide-react";
import React from "react";
import { format } from "date-fns";

type Activity = {
  type: "Staked" | "Withdrawn" | "RewardsClaimed";
  user: string;
  amount: string;
  timestamp: string; // Assuming timestamp is in ISO format
};

type Props = {
  activity: Activity;
};

const ActivityRow = ({ activity }: Props) => {
  const formattedTimestamp = format(new Date(activity.timestamp), "PPpp");

  const getActivityIcon = (type: string) => {
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
  const getCurrency = (type: string) => {
    switch (type) {
      case "Staked":
        return "DTX";
      case "Withdrawn":
        return "DTX";
      case "RewardsClaimed":
        return "dUSD";
      default:
        return "DTX";
    }
  };

  return (
    <div className="px-2 py-2 cursor-pointer hover:bg-secondary rounded-md">
      <div className="flex items-center">
        {getActivityIcon(activity.type)}
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{activity.type}</p>
          <p className="text-sm text-muted-foreground">{activity.user}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="font-medium">
            {activity.amount} {getCurrency(activity.type)}
          </p>
          <p className="text-sm text-muted-foreground">{formattedTimestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityRow;
