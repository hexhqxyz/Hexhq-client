"use client";

import React, { useEffect, useState } from "react";
import { ethers, TransactionReceipt } from "ethers";
import { useDebounceValue } from "usehooks-ts";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { CryptoInput, Input } from "../../ui/input";
import { Label, LabelValueRow } from "../../ui/label";
import { Heading } from "../../ui/Typography";
import { Button } from "../../ui/button";

import { ApproveTokenSchema } from "@/lib/zod-validation";
import { formatNumber, roundToNearestHalf } from "@/lib/utils";
import { useWeb3Store } from "@/store/signer-provider-store";
import { useStakingStore } from "@/store/staking-store";
import { decodeStakingError } from "@/lib/decodeError";
import { useTokenStore } from "@/store/token-store";
import { BLOCK_EXPLORER, STAKING_ADDRESS } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

type Props = {};

type FormData = {
  amount: string;
};

const Repay = (props: Props) => {
  const {
    setTotalStakedAmount,
    totalBorrowedAmount,
    setTotalBorrowedAmount,
    totalStakedAmount,
    stakingContract,
  } = useStakingStore();
  const {
    stakingTokenContract,
    rewardTokenContract,
    setAvailableStakingTokenBalance,
  } = useTokenStore();
  const address = useWeb3Store().address;

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [totalAmountToRepay, setTotalAmountToRepay] = useState("0");
  const [totalInterest, setTotalInterest] = useState("0");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ApproveTokenSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    if (parseFloat(totalAmountToRepay) <= 0) {
      setError("amount", {
        message: "Amount must be equal to the repay amount ",
      });
      return;
    }
    if (!stakingContract || !stakingTokenContract || !rewardTokenContract)
      return;
    try {
      console.log("data:", data);
      setIsLoading(true);

      const roundedRepayAmount = roundToNearestHalf(totalAmountToRepay);
      const finalAmountToRepay = ethers
        .parseUnits(roundedRepayAmount, 18)
        .toString();
      const maxFeePerGas = ethers.parseUnits("100", "gwei"); // 100 gwei
      const approveTx = await rewardTokenContract.approve(
        STAKING_ADDRESS,
        finalAmountToRepay,
        {
          maxFeePerGas: maxFeePerGas,
        }
      );

      const approveReceipt: TransactionReceipt = await approveTx.wait();
      console.log("approve receipt", approveReceipt);
      const borrowedAmount = ethers
        .parseUnits(totalBorrowedAmount, 18)
        .toString();
      const tx = await stakingContract.repayLoan(borrowedAmount, {
        maxFeePerGas: maxFeePerGas,
      });
      const toastId = toast.loading(
        "Your ATX is being staked! This may take a few moments"
      );
      const receipt: TransactionReceipt = await tx.wait();
      console.log("receipt:", receipt);
      toast.success("Successfully Repayed! 💯", {
        description: "Your ATX tokens has unlocked and loan has closed",
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
      setAvailableStakingTokenBalance();
      setTotalStakedAmount();
      setTotalBorrowedAmount();
      getTotalRepayAmount();
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

  const getTotalRepayAmount = async () => {
    if (!stakingContract || !address) return;
    const amount = await stakingContract.calculateRepayAmount(address);
    const interest = await stakingContract.calculateInterest(address);
    const formattedRepayAmount = ethers.formatUnits(amount, 18);
    const formattedInterest = ethers.formatUnits(interest, 18);
    setTotalAmountToRepay(formattedRepayAmount);
    setTotalInterest(formattedInterest);
    setValue("amount", formatNumber(formattedRepayAmount));
  };

  useEffect(() => {
    if (!address || !stakingContract) return;
    getTotalRepayAmount();

    const interval = setInterval(() => {
      getTotalRepayAmount();
    }, 20000);

    return () => clearInterval(interval);
  }, [address, stakingContract]);

  return (
    <div className="mx-auto lg::max-w-lg w-full p-4">
      <Heading variant="h3" className="mb-1">
        Repay Loan
      </Heading>
      <p className="mb-4 text-sm text-muted-foreground">
        Repay your loan to withdraw or take loan again
      </p>

      <form onSubmit={onSubmit} className="space-y-2">
        <CryptoInput
          onMaxClick={() => {}}
          disabled={true}
          error={errors.amount}
          {...register("amount")}
        />

        <LabelValueRow
          tooltip="Amount that you need to pay"
          label="Repayable amount"
          value={<>{formatNumber(totalAmountToRepay)} dUSD</>}
        />
        <LabelValueRow
          tooltip="Annual percentage yield (APY)"
          label="Borrowed APY"
          value={<>~5.2%</>}
        />

        <Separator />

        <LabelValueRow
          tooltip="Principle amount you borrowed"
          label="Principle amount"
          value={<>{formatNumber(totalBorrowedAmount)} dUSD</>}
        />
        <LabelValueRow
          tooltip="Interest occured till now (updated every 20 seconds)"
          label="Interest*"
          value={<>{formatNumber(totalInterest)} dUSD</>}
        />
        <div className="bg-secondary rounded-lg px-2 py-2 mt-2">
          <LabelValueRow
            tooltip="Total amount you need to pay (principle + interest)"
            label="Total amount to repay*"
            value={<>{formatNumber(totalAmountToRepay)} dUSD</>}
          />
        </div>

        <Button
          type="submit"
          disabled={totalStakedAmount === "0.0"}
          variant={"invert"}
          loading={isLoading}
          className="w-full !mt-4"
        >
          Repay {formatNumber(totalAmountToRepay)} dUSD 🎯
        </Button>
      </form>
    </div>
  );
};

export default Repay;
