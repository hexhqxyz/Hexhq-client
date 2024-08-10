"use client";

import React, { useEffect, useState } from "react";
import { Heading } from "@/components/ui/Typography";
import PercentageSlider from "../PercentageSlider";
import { Button } from "@/components/ui/button";
import { useDebounceValue } from "usehooks-ts";
import { Label, LabelValueRow } from "@/components/ui/label";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useTokenStore } from "@/store/token-store";
import { useAmmStore } from "@/store/amm-store";
import { formatNumber, formatNumberSmall } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
import { useWeb3Store } from "@/store/signer-provider-store";
import { AMM_CONTRACT_ADDRESS, BLOCK_EXPLORER } from "@/lib/constants";
import { ethers, TransactionReceipt } from "ethers";
import { toast } from "sonner";
import { decodeAmmError } from "@/lib/decodeError";

type Props = {};

const RemoveLiquidity = (props: Props) => {
  const address = useWeb3Store().address;
  const {
    tokenDetails,
    stakingTokenContract,
    rewardTokenContract,
    setAvailableStakingTokenBalance,
  } = useTokenStore();
  const { priceToken1InToken2, priceToken2InToken1, ammContract } =
    useAmmStore();
  const [receivableDtx, setReceivableDtx] = useState("0");
  const [receivableDusd, setReceivableDusd] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  const [debouncedSliderValue, setDebouncedSliderValue] = useDebounceValue(
    0,
    200
  );
  const [sliderValue, setSliderValue] = useState(0);
  const handlePresetPercentClick = (val: number) => {
    setSliderValue(val);
    setDebouncedSliderValue(val);
  };

  const getReceivableAmount = async (percent: number) => {
    if (!ammContract) return;
    try {
      const parsedPercent = ethers
        .parseUnits(percent.toString(), 18)
        .toString();
      const balances = await ammContract.calculateUserLiquidityWithdrawal(
        address,
        parsedPercent
      );
      console.log("balances:", balances);

      const formattedBalanceDtx = ethers.formatUnits(balances[0]);
      const formattedBalanceDusd = ethers.formatUnits(balances[1]);
      setReceivableDtx(formattedBalanceDtx);
      setReceivableDusd(formattedBalanceDusd);
    } catch (error) {
      console.log("err:", error);
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!ammContract || !stakingTokenContract || !rewardTokenContract) return;
    if (debouncedSliderValue <= 0) {
      toast.error(
        "Please use slider or select from presets to set percentage of the amount you wish to remove"
      );
      return;
    }
    setIsLoading(true);

    try {
      const userLiquidity = await ammContract.liquidity(address);
      console.log("user liquidity:", userLiquidity);
      if (userLiquidity <= 0) {
        setIsLoading(false);
        toast.info("Insufficient liquidity")
        return;
      }

      const formattedUserLiquidity = ethers.formatUnits(userLiquidity, 18);
      console.log("formatted liquidity:", formattedUserLiquidity)
      if (Math.round(parseFloat(formattedUserLiquidity)) <= 0) {
        toast.error("No liquidity found. Please liquidiate some amount first");
        setIsLoading(false);
        return;
      }
      if(parseFloat(formattedUserLiquidity) <= 0) {
        toast.info("Insufficient liquidity")
        setIsLoading(false);
        return;
      }
      console.log("formatted user liquidity:", formattedUserLiquidity);

      let liquidityToRemove;
      if (debouncedSliderValue === 100) {
        liquidityToRemove = userLiquidity;
      } else {
        const percentToRemove =
          (parseFloat(formattedUserLiquidity) * debouncedSliderValue) / 100;
        liquidityToRemove = ethers
          .parseUnits(percentToRemove.toString(), 18)
          .toString();
      }
      console.log(
        "amount to remove:",
        ethers.formatUnits(liquidityToRemove, 18)
      );
      console.log("amount to remove:", liquidityToRemove);

      console.log("amount to remove:", liquidityToRemove);

      const maxFeePerGas = ethers.parseUnits("100", "gwei"); // 100 gwei
      const amountToSend = ethers
        .parseUnits(liquidityToRemove.toString(), 18)
        .toString();

      const liquidityTx = await ammContract
        .removeLiquidity(liquidityToRemove, {
          maxFeePerGas: maxFeePerGas,
        })
        .then((data) => data)
        .catch(async (err) => {
          console.log("err:", err);
          const parsedError = await decodeAmmError(err);
          console.log("decodedErr in catch:", parsedError);
          toast.error(parsedError.title, {
            description: parsedError.description || "",
          });
          toast.dismiss(toastId);
          throw new Error("CustomError");
        });

      let toastId = toast.loading(
        "Removal liquidity from the pool is being done! This may take a few moments"
      );

      const receipt: TransactionReceipt = await liquidityTx.wait();

      toast.success("Liquidity removed from the pool successful! ✅", {
        description: `Removed ${debouncedSliderValue}% liquidity`,
        action: {
          label: "See Tx",
          onClick: () => {
            window.open(`${BLOCK_EXPLORER}/tx/${receipt.hash}`);
          },
        },
        id: toastId,
      });
      setIsLoading(false);
      setAvailableStakingTokenBalance();
      setSliderValue(0);
      setDebouncedSliderValue(0);
    } catch (error:any) {
      console.log("error:", error)
      if (error === "CustomError" || error?.message === "CustomError") {
      } else {
        toast.dismiss();
      }
      setIsLoading(false);
    }

  };

  useEffect(() => {
    if (!debouncedSliderValue) return;
    getReceivableAmount(debouncedSliderValue);
  }, [debouncedSliderValue]);

  return (
    <div className="space-y-4 p-2">
      <Card className="px-4 py-2 space-y-8">
        <Heading variant="h4">Percent to remove</Heading>
        <CardContent className="p-0 space-y-8">
          <Heading variant="h5" className="text-5xl">
            {sliderValue}%
          </Heading>
          <div className="space-y-6">
            <PercentageSlider
              disabled={isLoading}
              defaultValue={0}
              value={sliderValue}
              onValueChange={(val) => {
                setSliderValue(val[0]);
                setDebouncedSliderValue(val[0]);
              }}
            />

            <div>
              <div className="grid grid-cols-4 gap-x-4 text-sm">
                {[25, 50, 75, 100].map((item, index) => (
                  <Button
                    size={"sm"}
                    type="button"
                    variant={"secondary"}
                    key={item}
                    className="text-center cursor-pointer rounded-2xl"
                    onClick={() => handlePresetPercentClick(item)}
                  >
                    {item}%
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <ArrowDown className="text-muted-foreground w-5 h-5" />
      </div>
      <Card className="px-4 py-2 space-y-4">
        <Heading variant="h4">You&apos;ll receive </Heading>
        <CardContent className="p-0 space-y-2">
          <LabelValueRow
            label={
              <Heading className="text-primary">
                {debouncedSliderValue > 0
                  ? `~${formatNumber(receivableDtx, false, 4)}`
                  : "-"}
              </Heading>
            }
            value={
              <>
                <div className="flex items-center gap-x-2 text-xl text-primary font-semibold">
                  <Image
                    width={20}
                    height={20}
                    src="/dtx-token.svg"
                    alt="icon"
                  />
                  {tokenDetails.dtx.symbol}
                </div>
              </>
            }
          />
          <LabelValueRow
            label={
              <Heading className="text-primary">
                {debouncedSliderValue > 0
                  ? `~${formatNumber(receivableDusd, false, 2)}`
                  : "-"}
              </Heading>
            }
            value={
              <>
                <div className="flex items-center gap-x-2 text-xl text-primary font-semibold">
                  <Image
                    width={20}
                    height={20}
                    src="/dtx-token.svg"
                    alt="icon"
                  />
                  {tokenDetails.dusd.symbol}
                </div>
              </>
            }
          />
        </CardContent>
      </Card>

      <LabelValueRow
        label="Price:"
        value={
          <div>
            <p>1 DTX = {parseFloat(priceToken1InToken2).toFixed(4)} dUSD</p>
            <p>1 dUSD = {parseFloat(priceToken2InToken1).toFixed(4)} DTX</p>
          </div>
        }
      />
      <Button
        onClick={handleRemoveLiquidity}
        variant={"invert"}
        loading={isLoading}
        className="w-full"
      >
        Remove Liquidity 🙋
      </Button>
    </div>
  );
};

export default RemoveLiquidity;
