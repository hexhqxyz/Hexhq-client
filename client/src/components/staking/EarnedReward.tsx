"use client";

import { ApproveTokenSchema } from "@/lib/zod-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useWeb3Store } from "@/store/signer-provider-store";
import { STAKING_ADDRESS } from "@/lib/constants";
import { Contract, ethers } from "ethers";

import STAKING_ABI from "@/lib/abis/Staking.json";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useStakingStore } from "@/store/staking-store";

type Props = {};

const EarnedReward = (props: Props) => {
  const [earnedReward, setEarnedReward] = useState("0");
  const [rewardRate, setRewardRate] = useState("0");
  const { address } = useWeb3ModalAccount();
  const { signer } = useWeb3Store();
  const { stakingContract } = useStakingStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const getStakedEarnedReward = async () => {
    if (!stakingContract) return;
    setIsLoading(true);
    try {
      const stakedBalance = await stakingContract.earned(address);
      const amount = ethers.formatUnits(stakedBalance, 18);
      const roundedReward = parseFloat(amount)?.toFixed(2);

      setEarnedReward(roundedReward);
      console.log("setEarnedReward amount:", amount);
    } catch (error) {
      console.log("error:", error);
    }
    setIsLoading(false);
  };
  const getRewardRate = async () => {
    if (!stakingContract) return;
    setIsLoading(true);
    console.log("calling it getStakedEarnedReward...");
    try {
      const rewardRate = await stakingContract.rewardRate();
      console.log("reward rate:", rewardRate);
      const amount = ethers.formatUnits(rewardRate, 18);
      setRewardRate(amount);
      console.log("reward rate amount:", amount);
    } catch (error) {
      console.log("error:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!address || !signer) return;
    getStakedEarnedReward();
    getRewardRate();

    const interval = setInterval(() => {
      getStakedEarnedReward();
    }, 20000);

    return () => clearInterval(interval);
  }, [address, signer]);

  return (
    <div>
      <div>Earned amount: {earnedReward} dUSD</div>
      <div>Reward: {rewardRate} dUSD / second</div>
    </div>
  );
};

export default EarnedReward;
