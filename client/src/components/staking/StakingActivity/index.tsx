"use client";

import React, { useEffect, useState } from "react";
import { InfoIcon, Loader2 } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQuery } from "@apollo/client";

import { Button } from "@/components/ui/button";
import { ExpandableCard } from "@/components/ui/ExpandableCard";
import ActivityRow, { getActivityIcon } from "./ActivityRow";
import ActivityDetails from "./ActivityDetails";

import { GET_USER_ACTIVITIES } from "@/lib/services/graphql/queries";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heading } from "@/components/ui/Typography";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [filter, setFilter] = useState("all");
  const PER_PAGE = 10;
  const [page, setPage] = useState(0);
  const [activities, setActivities] = useState<any>([]);

  const [hasMore, setHasMore] = useState(true);
  const { address } = useWeb3ModalAccount();
  const { loading, error, data, fetchMore } = useQuery(GET_USER_ACTIVITIES, {
    variables: { user: address, first: PER_PAGE, skip: 0, filter: filter },
  });

  const checkHasMore = (data: any) => {
    if (filter === "all") {
      if (
        data.rewardsClaimeds.length < PER_PAGE &&
        data.stakeds.length < PER_PAGE &&
        data.withdrawns.length < PER_PAGE
      ) {
        setHasMore(false);
      }
    } else if (filter === "stake" && data.stakeds.length < PER_PAGE) {
      setHasMore(false);
    } else if (filter === "withdraw" && data.withdrawns.length < PER_PAGE) {
      setHasMore(false);
    } else if (filter === "reward" && data.rewardsClaimeds.length < PER_PAGE) {
      setHasMore(false);
    }
  };

  const mergeAndSortData = (data: any) => {
    let stakedEvents: Activity[] = [];
    let withdrawnEvents: Activity[] = [];
    let rewardsClaimedEvents: Activity[] = [];

    if (filter === "all" || filter === "stake") {
      stakedEvents = data.stakeds.map((event: any) => ({
        type: "Staked",
        id: event.id,
        user: event.user,
        amount: event.amount,
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        timestamp: parseInt(event.blockTimestamp),
      }));
    }

    if (filter === "all" || filter === "withdraw") {
      withdrawnEvents = data.withdrawns.map((event: any) => ({
        type: "Withdrawn",
        id: event.id,
        user: event.user,
        amount: event.amount,
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        timestamp: parseInt(event.blockTimestamp),
      }));
    }

    if (filter === "all" || filter === "reward") {
      rewardsClaimedEvents = data.rewardsClaimeds.map((event: any) => ({
        type: "RewardsClaimed",
        id: event.id,
        user: event.user,
        amount: event.amount,
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        timestamp: parseInt(event.blockTimestamp),
      }));
    }

    const activities = [
      ...stakedEvents,
      ...withdrawnEvents,
      ...rewardsClaimedEvents,
    ];
    const sortedActivities = activities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setActivities(sortedActivities);
  };

  const handleLoadMore = () => {
    console.log("fetching more...");
    fetchMore({
      variables: {
        skip: (page + 1) * PER_PAGE,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (filter === "all") {
          if (
            !fetchMoreResult.rewardsClaimeds.length &&
            !fetchMoreResult.stakeds.length &&
            !fetchMoreResult.withdrawns.length
          ) {
            console.log("no more daa..........");
            setHasMore(false);

            return previousResult;
          }
        } else if (filter === "stake") {
          if (!fetchMoreResult.stakeds.length) {
            setHasMore(false);
            return previousResult;
          }
        } else if (filter === "withdraw") {
          if (!fetchMoreResult.withdrawns.length) {
            setHasMore(false);
            return previousResult;
          }
        } else if (filter === "reward") {
          if (!fetchMoreResult.rewardsClaimeds.length) {
            setHasMore(false);
            return previousResult;
          }
        }
        console.log("fetchMoreData", fetchMoreResult);
        setPage((prevPage) => prevPage + 1);

        return {
          ...previousResult,
          stakeds: [...previousResult.stakeds, ...fetchMoreResult.stakeds],
          withdrawns: [
            ...previousResult.withdrawns,
            ...fetchMoreResult.withdrawns,
          ],
          rewardsClaimeds: [
            ...previousResult.rewardsClaimeds,
            ...fetchMoreResult.rewardsClaimeds,
          ],
        };
      },
    });
  };

  useEffect(() => {
    if (data && !loading) {
      mergeAndSortData(data);
      checkHasMore(data);
    }
  }, [data, loading]);

  if (loading)
    return (
      <div>
        <div className="flex justify-between pb-4 px-4">
          <div>
            <Heading variant="h4">Your Activity</Heading>
          </div>
          <Select
            disabled={true}
            value={filter || "all"}
            onValueChange={(value) => setFilter(value)}
          >
            <SelectTrigger disabled className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem disabled value="all">
                All
              </SelectItem>
              <SelectItem disabled value="stake">
                Stake
              </SelectItem>
              <SelectItem disabled value="withdraw">
                Withdraw
              </SelectItem>
              <SelectItem disabled value="reward">
                Rewards
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="space-y-2">
            {Array(6)
              .fill(1)
              .map((item, index) => (
                <Skeleton key={index} className="h-4 w-full" />
              ))}
          </div>
        </div>
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="flex justify-between pb-4 px-4">
        <div>
          <Heading variant="h4">Your Activity</Heading>
        </div>
        <Select
          value={filter || "all"}
          onValueChange={(value) => {
            setFilter(value);
            setPage(0);
            setHasMore(true);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="stake">Stake</SelectItem>
            <SelectItem value="withdraw">Withdraw</SelectItem>
            <SelectItem value="reward">Rewards</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activities?.length <= 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Heading variant="h5" className="flex items-center gap-x-2">
            <InfoIcon className="text-muted-foreground h-5 w-5" />
            No Data Found
          </Heading>
          <p className="mb-6 md:px-20">
            We couldn&#39;t find any data matching your criteria. Try adjusting
            your filter or check back later.
          </p>
          <Button variant={"outline"} onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      )}

      {activities?.length > 0 && (
        <div id="scrollableDiv" className="h-96 overflow-y-auto">
          <InfiniteScroll
            dataLength={activities.length}
            next={handleLoadMore}
            hasMore={hasMore}
            loader={
              <div className="my-2">
                <Loader2 className="mx-auto h-10 w-10 animate-spin" />
              </div>
            }
            scrollableTarget="scrollableDiv"
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            <div className="max-w-2xl mx-auto w-full gap-4">
              {activities.map((activity: any, index: number) => (
                <ExpandableCard
                  key={activity.id + index}
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
              ))}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default StakingActivity;
