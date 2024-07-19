"use client";

import { ApproveTokenSchema } from "@/lib/zod-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label, LabelValueRow } from "../ui/label";
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
import { Heading } from "../ui/Typography";

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

  // const getApprovedAmount = async () => {
  //   try {
  //     const stakingTokenContract = new Contract(
  //       STAKING_TOKEN_CONTRACT_ADDRESS,
  //       STAKING_TOKEN_ABI.abi,
  //       signer
  //     );

  //     const allowance = await stakingTokenContract.allowance(
  //       address,
  //       STAKING_ADDRESS
  //     );
  //     console.log("allowance:", allowance);
  //     const amount = ethers.formatUnits(allowance, 18);
  //     console.log("allowance amount:", amount);
  //     setTotalApprovedAmount(amount);
  //   } catch (error) {
  //     console.log("error:", error);
  //   }
  // };

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
      setTotalApprovedAmount();
    } catch (error) {
      setIsLoading(false);
      console.log("error:", error);
    }
  });

  // useEffect(() => {
  //   if (!address || !signer) return;
  //   setTotalApprovedAmount();
  // }, [address, signer]);

  return (
    // <div className="bg-gray-50 p-4 rounded-lg shadow-md">
    <div className="">
      <Heading variant="h3" className="mb-2">
        Approve token
      </Heading>
      <p className="mb-4 text-sm text-muted-foreground">
        You need to approve tokens to the Staking contract before you can start
        your Staking Journey
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="amount">How much DTX do you want to approve?</Label>
          <Input
            disabled={isLoading}
            type="text"
            placeholder="enter amount"
            {...register("amount")}
            className="mt-1"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors?.amount.message}</p>
          )}
        </div>
        <LabelValueRow
          label="Total approved amount"
          value={<span className="font-semibold">{totalApprovedAmount} DTX</span>}
          tooltip="Amount you have approved to be staked later on"
        />
        {/* <div className="text-muted-foreground">
          Total approved amount:{" "}
          <span className="font-medium">{totalApprovedAmount} DTX</span>
        </div> */}
        <div className="flex justify-end w-full">
          <Button
            type="submit"
            loading={isLoading}
            variant={"invert"}
            className="w-full"
          >
            Approve
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ApproveToken;
