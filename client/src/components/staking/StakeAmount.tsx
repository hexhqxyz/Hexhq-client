"use client";

import { ApproveTokenSchema } from "@/lib/zod-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useWeb3Store } from "@/store/signer-provider-store";
import {
  STAKING_ADDRESS,
  STAKING_TOKEN_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { Contract, ethers, TransactionReceipt } from "ethers";

import STAKING_TOKEN_ABI from "@/lib/abis/StakingToken.json";
import STAKING_ABI from "@/lib/abis/Staking.json";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useStakingStore } from "@/store/staking-store";

type Props = {};

type FormData = {
  amount: string;
};

const StakeAmount = (props: Props) => {
  const { totalApprovedAmount, setTotalStakedAmount, totalStakedAmount,stakingContract } =
    useStakingStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ApproveTokenSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    if (Number(data.amount) > Number(totalApprovedAmount)) {
      setError("amount", {
        message: "Amount must be below or equal to the approved DTX tokens ",
      });
      return;
    }
    if(!stakingContract) return;
    try {
      console.log("data:", data);
      setIsLoading(true);
      
      const amountToStake = ethers.parseUnits(data.amount, 18).toString();

      const maxFeePerGas = ethers.parseUnits("100", "gwei"); // 100 gwei
      const tx = await stakingContract.stake(amountToStake, {
        maxFeePerGas: maxFeePerGas,
      });
      console.log("tx:", tx);

      const receipt: TransactionReceipt = await tx.wait();
      console.log("receipt:", receipt);

      setIsLoading(false);
      reset();
      setTotalStakedAmount();
    } catch (error) {
      setIsLoading(false);
      console.log("error:", error);
    }
  });

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            disabled={isLoading}
            type="text"
            placeholder="24"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors?.amount.message}</p>
          )}
        </div>
        <div>total staked amount: {totalStakedAmount}</div>
        <Button type="submit" loading={isLoading}>
          Stake
        </Button>
      </form>
    </div>
  );
};

export default StakeAmount;
