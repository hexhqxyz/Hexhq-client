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
import STAKING_ABI from "@/lib/abis/Staking.json";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useStakingStore } from "@/store/staking-store";
import { Heading } from "../ui/Typography";
import { ArrowRight } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";

type Props = {};

type FormData = {
  amount: string;
};

const WithdrawAmount = (props: Props) => {
  const {
    setTotalStakedAmount,
    totalStakedAmount,
    stakingContract,
    totalApprovedAmount,
  } = useStakingStore();
  const [debouncedValue, setDebouncedValue] = useDebounceValue("", 500);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ApproveTokenSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    if (Number(data.amount) > Number(totalStakedAmount)) {
      setError("amount", {
        message: "Amount must be below or equal to the staked DTX tokens ",
      });
      return;
    }
    if (!stakingContract) return;

    try {
      console.log("data:", data);
      setIsLoading(true);

      const amountToStake = ethers.parseUnits(data.amount, 18).toString();

      const maxFeePerGas = ethers.parseUnits("100", "gwei"); // 100 gwei
      const tx = await stakingContract.withdrawStakedTokens(amountToStake, {
        maxFeePerGas: maxFeePerGas,
      });
      console.log("tx:", tx);

      const receipt: TransactionReceipt = await tx.wait();
      console.log("receipt:", receipt);

      setIsLoading(false);
      reset();
      setTotalStakedAmount();
      setDebouncedValue("");
    } catch (error) {
      setIsLoading(false);
      console.log("error:", error);
    }
  });

  const handlePricePercentClick = (percent: number) => {
    const amount = (Number(totalStakedAmount) * percent) / 100;
    setValue("amount", parseFloat(amount.toString()).toFixed(2));
  };

  const amount = watch("amount");

  useEffect(() => {
    if (!amount) {
      setDebouncedValue("");
      return;
    }
    if (parseFloat(amount) > parseFloat(totalStakedAmount)) {
      setDebouncedValue("");
      setError("amount", {
        message: "Amount must be below or equal to the Staked DTX tokens",
      });
    } else {
      clearErrors("amount");
      setDebouncedValue(amount);
    }
  }, [amount]);

  return (
    <div className="">
      <Heading variant="h3" className="mb-4">
        Withdraw amount
      </Heading>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="amount">How much DTX do you want to withdraw?</Label>
          <Input
            disabled={isLoading}
            type="text"
            placeholder="Enter amount"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors?.amount.message}</p>
          )}
        </div>
        <div className="grid grid-cols-4 gap-x-4 text-sm !mt-2">
          {[25, 50, 75, 100].map((item, index) => (
            <p
              key={item}
              onClick={() => handlePricePercentClick(item)}
              className="py-1 bg-secondary text-center rounded-sm cursor-pointer"
            >
              {item}%
            </p>
          ))}
        </div>
        {debouncedValue && (
          <div className="bg-secondary rounded-lg px-2 py-2 mt-2">
            <LabelValueRow
              tooltip="Staked DTX change"
              label="Staked"
              value={
                <>
                  {totalStakedAmount}
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />{" "}
                  {parseFloat(totalStakedAmount) - parseFloat(debouncedValue) ||
                    "0.0"}
                </>
              }
            />
          </div>
        )}

          <Button
            type="submit"
            variant={"invert"}
            loading={isLoading}
            className="w-full"
          >
            Withdraw
          </Button>
      </form>
    </div>
  );
};

export default WithdrawAmount;
