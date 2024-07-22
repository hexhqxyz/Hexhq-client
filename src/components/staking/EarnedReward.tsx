"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {  Gift, Trophy } from "lucide-react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

import { useWeb3Store } from "@/store/signer-provider-store";
import { useStakingStore } from "@/store/staking-store";
import InfoCard from "../ui/InfoCard";

type Props = {};

const EarnedReward = (props: Props) => {
  const [rewardDate, setRewardDate] = useState("0");
  const { address } = useWeb3ModalAccount();
  const { signer } = useWeb3Store();
  const { stakingContract,totalRewardsEarned,setTotalRewardsEarned,totalStakedAmount } = useStakingStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const getStakedEarnedReward = async () => {
    if (!stakingContract) return;
    setIsLoading(true);
    try {
      const stakedBalance = await stakingContract.earned(address);
      const amount = ethers.formatUnits(stakedBalance, 18);
      const roundedReward = parseFloat(amount)?.toFixed(2);

      setTotalRewardsEarned(roundedReward);
      console.log("setEarnedReward amount:", amount);
    } catch (error) {
      console.log("error:", error);
    }
    setIsLoading(false);
  };
  const getRewardRate = async () => {
    if (!stakingContract) return;
    setIsLoading(true);
    try {
      const rewardRate = await stakingContract.rewardRate();
      const amount = ethers.formatUnits(rewardRate, 18);
      setRewardDate(amount);
      console.log("reward rate amount:", amount);
    } catch (error) {
      console.log("error:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!address || !signer || !stakingContract) return;
    getStakedEarnedReward();
    getRewardRate();

    const interval = setInterval(() => {
      getStakedEarnedReward();
    }, 20000);

    return () => clearInterval(interval);
  }, [address, signer,stakingContract]);

  return (
    <>
      <InfoCard
        icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
        title="Current reward rate"
        value={`${rewardDate} dUSD`}
        subValue="per second"
      />
      <InfoCard
        icon={<Gift className="h-4 w-4 text-muted-foreground" />}
        title="Your rewards"
        value={`${totalRewardsEarned} dUSD*`}
        subValue="Updated every 40 seconds*"
      />
    </>
  );
};

export default EarnedReward;
