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
import { useTokenStore } from "@/store/token-store";
import { useStakingStore } from "@/store/staking-store";
import { LabelValueRow } from "@/components/ui/label";
import { useWeb3Store } from "@/store/signer-provider-store";
import { decodeAmmError } from "@/lib/decodeError";
import { formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Props = {};

const Swap = (props: Props) => {
  const [swapQuotes, setSwapQuotes] = useState({
    amountOut: "0.0",
    fee: "0.0",
    newPrice: "0.0",
  });

  const [estimatedGasFees, setEstimatedGasFees] = useState("0.00");
  const [fromToken, setFromToken] = useState<TOKEN_TYPE>("DTX");
  const [toToken, setToToken] = useState<TOKEN_TYPE>("dUSD");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [swapDetailsLoading, setSwapDetailsLoading] = useState(false);
  const {
    availableStakingTokenBalance,
    availableRewardTokenBalance,
    tokenDetails,
  } = useTokenStore();

  const ammContract = useAmmStore().ammContract;
  const provider = useWeb3Store().provider;

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

  const handleSwap = async () => {
    const fromAmount = getValues().fromAmount;
    const toAmount = getValues().toAmount;
    setFromToken(toToken);
    setToToken(fromToken);

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
        formatNumber(amountOut, false)
      );
      setEstimatedGasFees("0.24");
    } catch (error) {
      console.log("error in swap details..", error);
    }
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
      setSwapQuotes({
        amountOut: "0.0",
        fee: "0.0",
        newPrice: "0.0"
      })
      setEstimatedGasFees("0.0")
    }
    debouncedGetSwapDetails(fromOrTo, token, amount);
  };

  const calculateMinReceived = (amount: string) => {
    const slippage = 0.05; // 5% slippage
    const minAmountOut = parseFloat(amount) * (1 - slippage);
    return minAmountOut;
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
              balance={`${availableStakingTokenBalance} ${tokenDetails.dtx.symbol}`}
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
              balance={`${availableRewardTokenBalance} ${tokenDetails.dusd.symbol}`}
              {...register("toAmount")}
              onChange={(e) =>
                getRequiredTokenAmount("toAmount", toToken, e.target.value)
              }
            />
          </div>

          <Button
            type="submit"
            loading={isLoading || swapDetailsLoading}
            size={"lg"}
            className="w-full mt-2"
          >
            Swap
          </Button>
        </form>

        {/* Swap info */}
        <div className="my-2 p-2">
          <LabelValueRow
            label="Price impact"
            value="-03%"
            tooltip="The impact your trade has on the market price of this pool."
          />
          <LabelValueRow
            label={"Est. received"}
            value={`~${formatNumber(swapQuotes.amountOut)} ${toToken}`}
          />
          <LabelValueRow
            label="Min. received"
            value={`${formatNumber(
              calculateMinReceived(swapQuotes.amountOut)
            )} ${toToken}`}
          />
          <LabelValueRow
            label="Max. slippage"
            value={
              <>
                <span>
                  <Badge variant="secondary">Auto</Badge>
                </span>{" "}
                0.5%
              </>
            }
            tooltip="The maximum price movement before your transaction will revert."
          />
          <LabelValueRow
            label="Fee (1%)"
            value={`${formatNumber(swapQuotes.fee)} ${fromToken}`}
            tooltip="This fee is applied on select token pairs to ensure the best experience with Uniswap. It is paid in the output token and has already been factored into the quote."
          />
          <LabelValueRow
            label="Network cost"
            value={`$${formatNumber(estimatedGasFees)}`}
            tooltip="The maximum price movement before your transaction will revert."
          />
        </div>
      </div>
    </div>
  );
};

export default Swap;
