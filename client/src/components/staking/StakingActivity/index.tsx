import React from "react";
import ActivityRow from "./ActivityRow";

type Props = {};

type Activity = {
  type: "Staked" | "Withdrawn" | "RewardsClaimed";
  user: string;
  amount: string;
  timestamp: string; // ISO date string
};

const activities: Activity[] = [
  {
    type: "Staked",
    user: "0x123...abc",
    amount: "1000",
    timestamp: "2024-07-15T12:34:56Z",
  },
  {
    type: "Withdrawn",
    user: "0x123...abc",
    amount: "500",
    timestamp: "2024-07-15T13:45:56Z",
  },
  {
    type: "RewardsClaimed",
    user: "0x123...abc",
    amount: "200",
    timestamp: "2024-07-15T14:56:56Z",
  },
  {
    type: "Staked",
    user: "0x123...abc",
    amount: "300",
    timestamp: "2024-07-15T15:45:56Z",
  },
];

const mergeAndSortActivities = (activities: Activity[]): Activity[] => {
  return activities.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

const StakingActivity = (props: Props) => {
  const sortedActivities = mergeAndSortActivities(activities);

  console.log("groupActiviites:", sortedActivities);

  return (
    <div>
      <div className="space-y-2">
        {sortedActivities.map((activity: any, index: any) => (
          <ActivityRow key={index} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default StakingActivity;
