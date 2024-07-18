"use client";

import React from "react";
import ActivityRow, { getActivityIcon } from "./ActivityRow";
import { useQuery } from "@apollo/client";
import { GET_USER_ACTIVITIES } from "@/lib/services/graphql/queries";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExpandableCard } from "@/components/ui/ExpandableCard";
import ActivityDetails from "./ActivityDetails";
import { motion } from "framer-motion";

type Props = {};

type Activity = {
  type: "Staked" | "Withdrawn" | "RewardsClaimed";
  user: string;
  amount: string;
  timestamp: number;
  transactionHash: string;
  blockNumber: string;
  id: string;
};

const StakingActivity = (props: Props) => {
  const { address } = useWeb3ModalAccount();
  const { loading, error, data } = useQuery(GET_USER_ACTIVITIES, {
    variables: { user: address },
  });
  console.log("loading:", loading, "data", data, "error:", error);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const stakedEvents: Activity[] = data.stakeds.map((event: any) => ({
    type: "Staked",
    id: event.id,
    user: event.user,
    amount: event.amount,
    transactionHash: event.transactionHash,
    blockNumber: event.blockNumber,
    timestamp: parseInt(event.blockTimestamp),
  }));

  const withdrawnEvents: Activity[] = data.withdrawns.map((event: any) => ({
    type: "Withdrawn",
    id: event.id,
    user: event.user,
    amount: event.amount,
    transactionHash: event.transactionHash,
    blockNumber: event.blockNumber,
    timestamp: parseInt(event.blockTimestamp),
  }));

  const rewardsClaimedEvents: Activity[] = data.rewardsClaimeds.map(
    (event: any) => ({
      type: "RewardsClaimed",
      id: event.id,
      user: event.user,
      amount: event.amount,
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
      timestamp: parseInt(event.blockTimestamp),
    })
  );

  const activities = [
    ...stakedEvents,
    ...withdrawnEvents,
    ...rewardsClaimedEvents,
  ];
  const sortedActivities = activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div>
      <ScrollArea className="h-96 w-full rounded-md">
        <ul className="max-w-2xl mx-auto w-full gap-4">
          {sortedActivities.map((activity, index) => (
            <li key={index}>
              <ExpandableCard
                title={
                  <div className="flex items-center gap-x-2">
                    {getActivityIcon(activity.type)}
                    {activity.type}
                  </div>
                }
                expandedContent={<ActivityDetails activity={activity} />}
                id={activity.id}
              >
                <ActivityRow activity={activity} />
              </ExpandableCard>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default StakingActivity;
