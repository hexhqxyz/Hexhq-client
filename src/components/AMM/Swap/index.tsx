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
  AMM_CONTRACT_ADDRESS,
  BLOCK_EXPLORER,
  REWARD_TOKEN_ADDRESS,
  STAKING_TOKEN_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { ethers, TransactionReceipt } from "ethers";
import { useDebounceCallback } from "usehooks-ts";
import { useTokenStore } from "@/store/token-store";
import { useStakingStore } from "@/store/staking-store";
import { LabelValueRow } from "@/components/ui/label";
import { useWeb3Store } from "@/store/signer-provider-store";
import { decodeAmmError } from "@/lib/decodeError";
import { formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { fireConfetti } from "@/lib/utils/confetti";

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
    stakingTokenContract,
    rewardTokenContract,
    setAvailableStakingTokenBalance,
  } = useTokenStore();

  const {
    ammContract,
    priceToken1InToken2,
    priceToken2InToken1,
    setCurrentTokenPrices,
  } = useAmmStore();
  const provider = useWeb3Store().provider;

  const {
    handleSubmit,
    setValue,
    register,
    getValues,
    setError,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<z.infer<typeof swapSchema>>({
    resolver: zodResolver(swapSchema),
    defaultValues: {
      fromAmount: "",
      toAmount: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (parseFloat(data.fromAmount) <= 0) {
      setError("fromAmount", {
        message: "Amount must be greater then zero ",
      });
      return;
    }

    if (fromToken === "DTX") {
      if (
        parseFloat(data.fromAmount) > parseFloat(availableStakingTokenBalance)
      ) {
        setError("fromAmount", {
          message: "Amount cannot be greater then the available DTX tokens",
        });
        return;
      }
    } else if (fromToken === "dUSD") {
      if (
        parseFloat(data.fromAmount) > parseFloat(availableRewardTokenBalance)
      ) {
        setError("fromAmount", {
          message: "Amount cannot be greater then the available dUSD tokens",
        });

        return;
      }
    }
    if (!ammContract || !stakingTokenContract || !rewardTokenContract) return;
    setIsLoading(true);
    try {
      console.log("data:", data);

      const maxFeePerGas = ethers.parseUnits("100", "gwei"); // 100 gwei
      const amountToSend = ethers.parseUnits(data.fromAmount, 18).toString();
      const tokenIn =
        fromToken === "DTX"
          ? STAKING_TOKEN_CONTRACT_ADDRESS
          : REWARD_TOKEN_ADDRESS;
      const minAmountOut = ethers
        .parseUnits(calculateMinReceived(data.fromAmount), 18)
        .toString();

      let approveTx;
      if (fromToken === "DTX") {
        approveTx = await stakingTokenContract.approve(
          AMM_CONTRACT_ADDRESS,
          amountToSend,
          {
            maxFeePerGas: maxFeePerGas,
          }
        );
      } else if (fromToken === "dUSD") {
        approveTx = await rewardTokenContract.approve(
          AMM_CONTRACT_ADDRESS,
          amountToSend,
          {
            maxFeePerGas: maxFeePerGas,
          }
        );
      } else {
        throw new Error("Something went wrong");
      }

      const approveReceipt: TransactionReceipt = await approveTx?.wait();
      console.log("approve receipt", approveReceipt);

      const swapTx = await ammContract.swap(
        tokenIn,
        amountToSend,
        minAmountOut,
        { maxFeePerGas: maxFeePerGas }
      );
      const toastId = toast.loading(
        "Swapping is being done! This may take a few moments"
      );

      const receipt: TransactionReceipt = await swapTx.wait();

      toast.success("Swap successful! ✅", {
        description: `Swapped ${data.fromAmount} ${fromToken} for ${swapQuotes.amountOut} ${toToken}`,
        action: {
          label: "See Tx",
          onClick: () => {
            window.open(`${BLOCK_EXPLORER}/tx/${receipt.hash}`);
          },
        },
        id: toastId,
      });
      setIsLoading(false);
      fireConfetti();
      reset();
      setAvailableStakingTokenBalance();
      setCurrentTokenPrices();
    } catch (error) {
      toast.dismiss();
      setIsLoading(false);
      console.log("error:", error);
      const parsedError = await decodeAmmError(error);
      toast.error(parsedError.title, {
        description: parsedError.description || "",
      });
    }
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
        newPrice: "0.0",
      });
      setEstimatedGasFees("0.0");
    }
    clearErrors();
    debouncedGetSwapDetails(fromOrTo, token, amount);
  };

  const calculateMinReceived = (amount: string) => {
    const slippage = 0.05; // 5% slippage
    const minAmountOut = parseFloat(amount) * (1 - slippage);
    return minAmountOut.toString();
  };

  const calculatePriceImpact = () => {
    const currentPrice =
      fromToken === "DTX" ? priceToken1InToken2 : priceToken2InToken1;
    const newPrice = parseFloat(swapQuotes.newPrice);
    const priceImpact =
      ((newPrice - parseFloat(currentPrice)) / parseFloat(currentPrice)) * 100;
    return priceImpact.toFixed(2);
  };

  return (
    <div>
      <div className="">
        <form onSubmit={onSubmit} className="">
          <div className="mb-8">
            <SwapInput
              disabled={isLoading}
              defaultValue={fromToken || "DTX"}
              selectValue={fromToken}
              error={errors.fromAmount}
              onSelectChange={(value: any) =>
                handleTokenChange("fromToken", value)
              }
              balance={`${formatNumber(availableStakingTokenBalance)} ${
                tokenDetails.dtx.symbol
              }`}
              {...register("fromAmount")}
              onChange={(e) =>
                getRequiredTokenAmount("fromAmount", fromToken, e.target.value)
              }
            />
          </div>
          <div className="flex justify-center !-mt-11 !-mb-11 items-center relative z-50">
            <Button
              onClick={handleSwap}
              type="button"
              variant={"outline"}
              size={"sm"}
              className="text-muted-foreground rounded-full"
            >
              <ArrowDownUp className="w-3 h-3" />
            </Button>
          </div>
          <div className="mt-8">
            <SwapInput
              disabled={isLoading}
              selectValue={toToken}
              defaultValue={toToken || "dUSD"}
              error={errors.toAmount}
              onSelectChange={(value: any) =>
                handleTokenChange("toToken", value)
              }
              balance={`${formatNumber(availableRewardTokenBalance)} ${
                tokenDetails.dusd.symbol
              }`}
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
            Swap 🚀
          </Button>
        </form>

        {/* Swap info */}
        <div className="my-2 p-2">
          {parseFloat(swapQuotes.amountOut) > 0 && (
            <>
              <LabelValueRow
                label="Price impact"
                value={`${calculatePriceImpact()}%`}
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
                label="Fee (1%)"
                value={`${formatNumber(swapQuotes.fee)} ${fromToken}`}
                tooltip="This fee is applied on select token pairs. It is paid in the output token and has already been factored into the quote."
              />
            </>
          )}

          <LabelValueRow
            label="Max. slippage"
            value={
              <>
                <span>
                  <Badge variant="secondary">Auto</Badge>
                </span>{" "}
                5%
              </>
            }
            tooltip="The maximum price movement before your transaction will revert."
          />

          <LabelValueRow
            label="Network cost"
            value={`$${formatNumber(estimatedGasFees)}`}
            tooltip="The network cost that will occur to complete the transaction onchain."
          />
        </div>
      </div>
    </div>
  );
};

export default Swap;
