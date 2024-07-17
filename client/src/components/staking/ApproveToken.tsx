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
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useStakingStore } from "@/store/staking-store";

type Props = {};

type FormData = {
  amount: string;
};

const ApproveToken = (props: Props) => {
  const { address } = useWeb3ModalAccount();
  const { signer } = useWeb3Store();
  const { totalApprovedAmount, setTotalApprovedAmount } = useStakingStore();

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

  const getApprovedAmount = async () => {
    try {
      const stakingTokenContract = new Contract(
        STAKING_TOKEN_CONTRACT_ADDRESS,
        STAKING_TOKEN_ABI.abi,
        signer
      );

      const allowance = await stakingTokenContract.allowance(
        address,
        STAKING_ADDRESS
      );
      console.log("allowance:", allowance);
      const amount = ethers.formatUnits(allowance, 18);
      console.log("allowance amount:", amount);
      setTotalApprovedAmount(amount);
    } catch (error) {
      console.log("error:", error);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log("data:", data);
      setIsLoading(true);
      const stakingTokenContract = new Contract(
        STAKING_TOKEN_CONTRACT_ADDRESS,
        STAKING_TOKEN_ABI.abi,
        signer
      );

      const amountToSend = ethers.parseUnits(data.amount, 18).toString();

      const maxFeePerGas = ethers.parseUnits("100", "gwei"); // 100 gwei
      const tx = await stakingTokenContract.approve(
        STAKING_ADDRESS,
        amountToSend,
        {
          maxFeePerGas: maxFeePerGas,
        }
      );
      console.log("tx:", tx);

      const receipt: TransactionReceipt = await tx.wait();
      console.log("receipt:", receipt);

      setIsLoading(false);
      reset();
      getApprovedAmount();
    } catch (error) {
        setIsLoading(false);
      console.log("error:", error);
    }
  });

  useEffect(() => {
    if (!address || !signer) return;
    getApprovedAmount();
  }, [address, signer]);

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
        <div>total approved amount: {totalApprovedAmount}</div>
        <Button type="submit" loading={isLoading}>
          Approve
        </Button>
      </form>
    </div>
  );
};

export default ApproveToken;
