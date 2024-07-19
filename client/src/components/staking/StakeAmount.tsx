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
import { useDebounceValue } from "usehooks-ts";
import { ArrowRight, ChevronRight, InfoIcon } from "lucide-react";
import { TooltipWrapper } from "../ui/tooltip";

type Props = {};

type FormData = {
  amount: string;
};

const StakeAmount = (props: Props) => {
  const {
    totalApprovedAmount,
    setTotalStakedAmount,
    totalStakedAmount,
    stakingContract,
  } = useStakingStore();
  const { provider, signer } = useWeb3Store();

  const [estimatedGasFees, setEstimatedGasFees] = useState("0.00");

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [debouncedValue, setDebouncedValue] = useDebounceValue("", 500);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    watch,
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
    if (!stakingContract) return;
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
      setDebouncedValue("")
      setTotalStakedAmount();
    } catch (error) {
      setIsLoading(false);
      console.log("error:", error);
    }
  });

  const handlePricePercentClick = (percent: number) => {
    const amount = (Number(totalApprovedAmount) * percent) / 100;
    setValue("amount", amount.toString());
  };

  const estimateGas = async (amount: string) => {
    if (!stakingContract) return;
    try {
      const amountToStake = ethers.parseUnits(amount, 18);
      const maxFeePerGas = ethers.parseUnits("100", "gwei"); // 100 gwei
      const estimatedGas = await stakingContract.stake.estimateGas(
        amountToStake,
        {
          maxFeePerGas: maxFeePerGas,
        }
      );
      const price = String((await provider?.getFeeData())?.gasPrice);
      if (price) {
        const gasCostInEther = estimatedGas.toString();
        const gasCostInEtherFormatted = ethers.formatEther(
          parseInt(gasCostInEther) * parseInt(price)
        );
        // const response = await fetch(
        //   "https://api.coinbase.com/v2/exchange-rates?currency=ETH"
        // );
        // const data = await response.json();
        // const ethToUsdRate = parseFloat(data.data.rates.USD);
        const ethToUsdRate = parseFloat("3395");
        const gasCostInUSD = (
          parseFloat(gasCostInEtherFormatted) * ethToUsdRate
        ).toFixed(4);
        console.log("gas price:", estimatedGas);
        setEstimatedGasFees(gasCostInUSD);
        return;
      }

      console.log("estimatedGas", estimatedGas);
      setEstimatedGasFees(estimatedGas.toString());
    } catch (error) {
      console.error("Failed to estimate gas:", error);
      // setEstimatedGasFees("0");
    }
  };

  const amount = watch("amount");

  useEffect(() => {
    if (!amount) return;
    setDebouncedValue(amount);
  }, [amount]);

  useEffect(() => {
    if (!debouncedValue) return;
    if (parseFloat(debouncedValue) <= parseFloat(totalApprovedAmount)) {
      clearErrors("amount");
      estimateGas(debouncedValue);
    } else {
      setError("amount", {
        message: "Amount must be below or equal to the approved DTX tokens ",
      });
    }
  }, [debouncedValue]);

  return (
    // <div className="bg-background border p-4 rounded-lg shadow-md">
    <div className="">
      <Heading variant="h3" className="mb-4">
        Stake Amount
      </Heading>
      <form onSubmit={onSubmit} className="space-y-2">
        <div className="grid gap-2">
          <Label htmlFor="amount">How much DTX do you want to stake?</Label>
          <Input
            disabled={isLoading}
            type="text"
            placeholder="enter amount"
            {...register("amount")}
            className="mt-1 block rounded-md shadow-sm"
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
                  {parseFloat(
                    (parseFloat(totalStakedAmount) as any) +
                      parseFloat(debouncedValue || "0.00")
                  ).toFixed(1)}
                </>
              }
            />
          </div>
        )}

        <LabelValueRow
          label="Gas price"
          value={<>~${estimatedGasFees}</>}
          tooltip="amount required to conduct a transaction onchain"
        />
          <Button
            type="submit"
            variant={"invert"}
            loading={isLoading}
            className="w-full"
          >
            Stake
          </Button>
      </form>
    </div>
  );
};

export default StakeAmount;
