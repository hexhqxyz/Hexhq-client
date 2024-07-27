"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SwapInput } from "../SwapInput";
import { ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { swapSchema } from "@/lib/zod-validation";
import { z } from "zod";
import { TOKEN_TYPE } from "@/lib/types";
import { useAmmStore } from "@/store/amm-store";
import {
  REWARD_TOKEN_ADDRESS,
  STAKING_TOKEN_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { ethers } from "ethers";
import { useDebounceCallback } from "usehooks-ts";

type Props = {};

const Swap = (props: Props) => {
  const [swapQuotes, setSwapQuotes] = useState({
    amountOut: "0",
    fee: "0",
    newPrice: "0",
  });
  const [fromToken, setFromToken] = useState<TOKEN_TYPE>("DTX");
  const [toToken, setToToken] = useState<TOKEN_TYPE>("dUSD");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [swapDetailsLoading, setSwapDetailsLoading] = useState(false);

  const ammContract = useAmmStore().ammContract;

  const { handleSubmit, setValue, register, getValues } = useForm<
    z.infer<typeof swapSchema>
  >({
    resolver: zodResolver(swapSchema),
    defaultValues: {
      fromAmount: "",
      toAmount: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    console.log("data:", data);
    setIsLoading(false);
  });
  const handleTokenChange = (
    field: "fromToken" | "toToken",
    value: TOKEN_TYPE
  ) => {
    if (field === "fromToken") {
      setFromToken(value);
      setToToken(value === "DTX" ? "dUSD" : "DTX");
    } else {
      setToToken(value);
      setFromToken(value === "DTX" ? "dUSD" : "DTX");
    }
  };

  const handleSwap = () => {
    const fromAmount = getValues().fromAmount;
    const toAmount = getValues().toAmount;
    setFromToken(toToken);
    setToToken(fromToken);

    console.log("from amount:", fromAmount);
    console.log("to amount:", toAmount);
    setValue("fromAmount", toAmount);
    setValue("toAmount", fromAmount);
  };

  const getSwapDetails = async (
    fromOrTo: "fromAmount" | "toAmount",
    token: TOKEN_TYPE,
    amount: string
  ) => {
    if (token !== "DTX" && token !== "dUSD") return;
    if (!amount) {
      setValue(fromOrTo === "fromAmount" ? "toAmount" : "fromAmount", "");
      return;
    }

    try {
      if (!ammContract) return;
      let tokenAddress =
        token === "DTX" ? STAKING_TOKEN_CONTRACT_ADDRESS : REWARD_TOKEN_ADDRESS;

      const parsedAmount = ethers.parseUnits(amount, 18).toString();

      console.log("calling api...");

      const details = await ammContract.getSwapDetails(
        tokenAddress,
        parsedAmount
      );

      const amountOut = ethers.formatUnits(details[0], 18);
      const fee = ethers.formatUnits(details[1], 18);
      const newPrice = ethers.formatUnits(details[2], 18);
      setSwapQuotes({
        amountOut,
        fee,
        newPrice,
      });
      setValue(
        fromOrTo === "fromAmount" ? "toAmount" : "fromAmount",
        amountOut
      );
    } catch (error) {}
  };

  const debouncedGetSwapDetails = useDebounceCallback(
    (
      fromOrTo: "fromAmount" | "toAmount",
      token: TOKEN_TYPE,
      amount: string
    ) => {
      getSwapDetails(fromOrTo, token, amount);
    },
    500
  );

  const getRequiredTokenAmount = async (
    fromOrTo: "fromAmount" | "toAmount",
    token: TOKEN_TYPE,
    amount: string
  ) => {
    if (!token || !amount) {
      if (fromOrTo === "fromAmount") {
        setValue("toAmount", "");
      } else {
        setValue("fromAmount", "");
      }
    }
    debouncedGetSwapDetails(fromOrTo, token, amount);
  };
  return (
    <div>
      <div className="">
        <form onSubmit={onSubmit} className="">
          <div className="mb-8">
            <SwapInput
              defaultValue={fromToken || "DTX"}
              selectValue={fromToken}
              onSelectChange={(value: any) =>
                handleTokenChange("fromToken", value)
              }
              balance="1000"
              {...register("fromAmount")}
              onChange={(e) =>
                getRequiredTokenAmount("fromAmount", fromToken, e.target.value)
              }
            />
          </div>
          <div className="flex justify-center !-mt-11 !-mb-11 items-center relative z-50">
            <Button
              onClick={handleSwap}
              variant={"outline"}
              size={"sm"}
              className="text-muted-foreground rounded-full"
            >
              <ArrowDownUp className="w-3 h-3" />
            </Button>
          </div>
          <div className="mt-8">
            <SwapInput
              selectValue={toToken}
              defaultValue={toToken || "dUSD"}
              onSelectChange={(value: any) =>
                handleTokenChange("toToken", value)
              }
              balance="1000"
              {...register("toAmount")}
              onChange={(e) =>
                getRequiredTokenAmount("toAmount", toToken, e.target.value)
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Swap;
