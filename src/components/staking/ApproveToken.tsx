"use client";

import React from "react";
import { Contract, ethers, TransactionReceipt } from "ethers";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input } from "../ui/input";
import { Label, LabelValueRow } from "../ui/label";
import { Button } from "../ui/button";
import { Heading } from "../ui/Typography";

import {
  BLOCK_EXPLORER,
  STAKING_ADDRESS,
} from "@/lib/constants";
import { defaultError } from "@/lib/errors";
import { ApproveTokenSchema } from "@/lib/zod-validation";
import { useStakingStore } from "@/store/staking-store";
import { useTokenStore } from "@/store/token-store";

type Props = {};

type FormData = {
  amount: string;
};

const ApproveToken = (props: Props) => {
  const { totalApprovedAmount, setTotalApprovedAmount,stakingTokenContract } = useTokenStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ApproveTokenSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    if(!stakingTokenContract) return;
    try {
      console.log("data:", data);
      setIsLoading(true);

      const amountToSend = ethers.parseUnits(data.amount, 18).toString();

      const maxFeePerGas = ethers.parseUnits("100", "gwei"); // 100 gwei
      const tx = await stakingTokenContract.approve(
        STAKING_ADDRESS,
        amountToSend,
        {
          maxFeePerGas: maxFeePerGas,
        }
      );
      const toastId = toast.loading(
        "Your ATX is being approved! This may take a few moments"
      );

      console.log("tx:", tx);

      const receipt: TransactionReceipt = await tx.wait();
      console.log("receipt:", receipt);
      toast.success("ATX tokens approved!", {
        description: "Your ATX tokens have been approved to use for staking",
        action: {
          label: "See Tx",
          onClick: () => {
            window.open(`${BLOCK_EXPLORER}/tx/${receipt?.hash}`);
          },
        },
        id: toastId,
      });

      setIsLoading(false);
      reset();
      setTotalApprovedAmount();
    } catch (error) {
      setIsLoading(false);
      console.log("error:", error);
      toast.dismiss();
      toast.error(defaultError.title, {
        description: defaultError.description || "",
      });
    }
  });

  return (
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
          <Label htmlFor="amount">How much ATX do you want to approve?</Label>
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
          value={
            <span className="font-semibold">{totalApprovedAmount} ATX</span>
          }
          tooltip="Amount you have approved to be staked later on"
        />
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
