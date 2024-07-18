"use client";

import React from "react";
import ActivityRow from "./ActivityRow";
import { useQuery } from "@apollo/client";
import { GET_USER_ACTIVITIES } from "@/lib/services/graphql/queries";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExpandableCardDemo } from "@/components/ui/ExbandableCard";

type Props = {};

type Activity = {
  type: "Staked" | "Withdrawn" | "RewardsClaimed";
  user: string;
  amount: string;
  timestamp: number;
  transactionHash: string;
  blockNumber: string;
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
    user: event.user,
    amount: event.amount,
    transactionHash: event.transactionHash,
    blockNumber: event.blockNumber,
    timestamp: parseInt(event.blockTimestamp),
  }));

  const withdrawnEvents: Activity[] = data.withdrawns.map((event: any) => ({
    type: "Withdrawn",
    user: event.user,
    amount: event.amount,
    transactionHash: event.transactionHash,
    blockNumber: event.blockNumber,
    timestamp: parseInt(event.blockTimestamp),
  }));

  const rewardsClaimedEvents: Activity[] = data.rewardsClaimeds.map(
    (event: any) => ({
      type: "RewardsClaimed",
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
  const sortedActivities = activities
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 10);

  return (
    <div>
      <ScrollArea className="h-96 w-full rounded-md">
        {/* {sortedActivities.map((activity, index) => (
          <ActivityRow key={index} activity={activity} />
        ))} */}
         <ExpandableCardDemo activities={sortedActivities} />

      </ScrollArea>
    </div>
  );
};

export default StakingActivity;
