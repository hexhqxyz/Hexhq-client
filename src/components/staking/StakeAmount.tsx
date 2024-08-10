"use client";

import React, { useEffect, useState } from "react";
import { ethers, TransactionReceipt } from "ethers";
import { useDebounceValue } from "usehooks-ts";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { CryptoInput, Input } from "../ui/input";
import { Label, LabelValueRow } from "../ui/label";
import { Heading } from "../ui/Typography";
import { Button } from "../ui/button";

import { ApproveTokenSchema } from "@/lib/zod-validation";
import { formatNumber } from "@/lib/utils";
import { useWeb3Store } from "@/store/signer-provider-store";
import { useStakingStore } from "@/store/staking-store";
import { decodeStakingError } from "@/lib/decodeError";
import { useTokenStore } from "@/store/token-store";
import { BLOCK_EXPLORER, STAKING_ADDRESS } from "@/lib/constants";
import { fireConfetti } from "@/lib/utils/confetti";

type Props = {};

type FormData = {
  amount: string;
};

const StakeAmount = (props: Props) => {
  const { setTotalStakedAmount, totalStakedAmount, stakingContract } =
    useStakingStore();
  const stakingTokenContract = useTokenStore().stakingTokenContract;

  const { provider } = useWeb3Store();
  const { availableStakingTokenBalance, setAvailableStakingTokenBalance } =
    useTokenStore();

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
    if (
      parseFloat(data.amount) <= 0 ||
      parseFloat(data.amount) > parseFloat(availableStakingTokenBalance)
    ) {
      setError("amount", {
        message: "Amount must be below or equal to the approved DTX tokens ",
      });
      return;
    }
    if (!stakingContract || !stakingTokenContract) return;
    try {
      console.log("data:", data);
      setIsLoading(true);

      const amountToStake = ethers.parseUnits(data.amount, 18).toString();

      const maxFeePerGas = ethers.parseUnits("100", "gwei"); // 100 gwei
      const approveTx = await stakingTokenContract.approve(
        STAKING_ADDRESS,
        amountToStake,
        {
          maxFeePerGas: maxFeePerGas,
        }
      );

      const approveReceipt: TransactionReceipt = await approveTx.wait();
      console.log("approve receipt", approveReceipt);

      const tx = await stakingContract.stake(amountToStake, {
        maxFeePerGas: maxFeePerGas,
      });
      const toastId = toast.loading(
        "Your DTX is being staked! This may take a few moments"
      );
      const receipt: TransactionReceipt = await tx.wait();
      console.log("receipt:", receipt);
      toast.success("Successfully Staked!", {
        description: "Your DTX tokens have been successfully staked",
        action: {
          label: "See Tx",
          onClick: () => {
            window.open(`${BLOCK_EXPLORER}/tx/${receipt?.hash}`);
          },
        },
        id: toastId,
      });

      setIsLoading(false);
      fireConfetti();
      reset();
      setDebouncedValue("");
      setAvailableStakingTokenBalance();
      setTotalStakedAmount();
    } catch (error) {
      toast.dismiss();
      setIsLoading(false);
      console.log("error:", error);
      const parsedError = await decodeStakingError(error);
      toast.error(parsedError.title, {
        description: parsedError.description || "",
      });
    }
  });

  const handlePricePercentClick = (percent: number) => {
    if (!parseFloat(availableStakingTokenBalance)) return;
    const amount = (parseFloat(availableStakingTokenBalance) * percent) / 100;
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
    if (
      parseFloat(debouncedValue) <= parseFloat(availableStakingTokenBalance)
    ) {
      clearErrors("amount");
      estimateGas(debouncedValue);
    } else {
      setError("amount", {
        message: "Amount must be below or equal to the approved DTX tokens ",
      });
    }
  }, [debouncedValue]);

  return (
    <div className="">
      <Heading variant="h3" className="mb-1">
        Stake Amount
      </Heading>
      <p className="mb-4 text-sm text-muted-foreground">
        Stake your DTX tokens easily by entering the amount and clicking Approve
        and Stake. Track your staked amount and gas fees in real-time.
      </p>

      <form onSubmit={onSubmit} className="space-y-2">
        <CryptoInput
          onMaxClick={() => {
            handlePricePercentClick(100);
          }}
          disabled={isLoading}
          error={errors.amount}
          {...register("amount")}
          label="How much DTX do you want to stake?"
        />
        <div className="grid grid-cols-4 gap-x-4 text-sm !mt-3">
          {[25, 50, 75, 100].map((item, index) => (
            <Button
              size={"sm"}
              type="button"
              variant={"secondary"}
              key={item}
              onClick={() => handlePricePercentClick(item)}
              className="text-center cursor-pointer rounded-2xl"
            >
              {item}%
            </Button>
          ))}
        </div>
        <LabelValueRow
          tooltip="You can stake 100% tokens that are owned by you"
          label="Suppliable amount"
          value={<>{formatNumber(availableStakingTokenBalance)} DTX</>}
        />
        {debouncedValue && (
          <div className="bg-secondary rounded-lg px-2 py-2 mt-2">
            <LabelValueRow
              tooltip="Staked DTX change"
              label="Staked"
              value={
                <>
                  {formatNumber(totalStakedAmount)}
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />{" "}
                  {formatNumber(
                    (parseFloat(totalStakedAmount) as any) +
                      parseFloat(debouncedValue || "0.00")
                  )}
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
          Approve and Stake 🚀
        </Button>
      </form>
    </div>
  );
};

export default StakeAmount;
