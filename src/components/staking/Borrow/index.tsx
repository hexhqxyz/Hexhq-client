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
import { formatNumber } from "@/lib/utils";
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

const Borrow = (props: Props) => {
  const {
    setTotalStakedAmount,
    totalBorrowedAmount,
    setTotalBorrowedAmount,
    totalStakedAmount,
    stakingContract,
  } = useStakingStore();
  const { availableStakingTokenBalance, setAvailableStakingTokenBalance,stakingTokenContract } =
    useTokenStore();
  const address = useWeb3Store().address;

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [debouncedValue, setDebouncedValue] = useDebounceValue("", 500);
  const [borrowingLimit, setBorrowingLimit] = useState("0");

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
      parseFloat(data.amount) > parseFloat(borrowingLimit)
    ) {
      setError("amount", {
        message: "Amount must be below or equal to the borrowing limt",
      });
      return;
    }
    if (parseFloat(totalBorrowedAmount) > 0) {
      setError("amount", {
        message: "Please repay your loan first",
      });
      return;
    }
    if (!stakingContract || !stakingTokenContract) return;
    try {
      console.log("data:", data);
      setIsLoading(true);

      const amountToStake = ethers.parseUnits(data.amount, 18).toString();

      const maxFeePerGas = ethers.parseUnits("100", "gwei"); // 100 gwei
      const tx = await stakingContract.takeLoan(amountToStake, {
        maxFeePerGas: maxFeePerGas,
      });
      const toastId = toast.loading(
        "Your ATX is being staked as colletral! This may take a few moments"
      );
      const receipt: TransactionReceipt = await tx.wait();
      console.log("receipt:", receipt);
      toast.success("Loan Sanctioned 🥳", {
        description:
          "Your dUSD tokens have been successfully sanctioned and transferred to your wallet",
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
      setDebouncedValue("");
      setAvailableStakingTokenBalance();
      setTotalStakedAmount();
      setTotalBorrowedAmount();
      getBorrowingLimit();
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

  const getBorrowingLimit = async () => {
    if (!stakingContract || !address) return;
    const limit = await stakingContract.calculateBorrowLimit(address);
    const formattedLimit = ethers.formatUnits(limit, 18);
    setBorrowingLimit(formattedLimit);
  };

  const currentBorrowingLimitUsed = () => {
    const maxBorrowAmount = 0.8 * parseFloat(totalStakedAmount);
    const borrowLimitUsed =
      (parseFloat(totalBorrowedAmount) / maxBorrowAmount) * 100;
    return borrowLimitUsed;
  };

  const handlePricePercentClick = (percent: number) => {
    if (!parseFloat(borrowingLimit)) return;
    const amount = (parseFloat(borrowingLimit) * percent) / 100;
    setValue("amount", amount.toString());
  };

  const amount = watch("amount");

  useEffect(() => {
    if (!amount) {
      setDebouncedValue("");
      clearErrors("amount");
      return;
    }
    setDebouncedValue(amount);
  }, [amount]);

  useEffect(() => {
    if (!debouncedValue) return;
    if (
      parseFloat(debouncedValue) <= parseFloat(availableStakingTokenBalance)
    ) {
      clearErrors("amount");
    } else {
      setError("amount", {
        message: "Amount must be below or equal to the approved ATX tokens ",
      });
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (totalStakedAmount === "0.0") {
      console.log("total staked amount:", totalStakedAmount);
      setError("amount", {
        message:
          "You need to stake ATX tokens and enable them as collateral before you can borrow dUSD from this pool",
      });
      return;
    }
    if (parseFloat(totalStakedAmount) > 0) {
      getBorrowingLimit();
    }
  }, [totalStakedAmount]);

  return (
    <div className="mx-auto lg::max-w-lg w-full p-4">
      <Heading variant="h3" className="mb-1">
        Borrow Amount
      </Heading>
      <p className="mb-4 text-sm text-muted-foreground">
        You can lend max 80% of the staked tokens. You will not be able to
        withdraw your ATX until you repay your loan
      </p>

      <form onSubmit={onSubmit} className="space-y-2">
        <CryptoInput
          onMaxClick={() => {
            handlePricePercentClick(100);
          }}
          disabled={totalStakedAmount === "0.0"}
          btnText="80% Limit"
          error={errors.amount}
          {...register("amount")}
          label="How much dUSD do you want to borrow?"
        />

        <div className="grid grid-cols-4 gap-x-4 text-sm !mt-3">
          {[25, 50, 75, 100].map((item, index) => (
            <Button
              type="button"
              key={item}
              variant={"secondary"}
              disabled={totalStakedAmount === "0.0"}
              size={"sm"}
              onClick={() => handlePricePercentClick(item)}
              className="text-center rounded-2xl cursor-pointer"
            >
              {item}%
            </Button>
          ))}
        </div>
        <LabelValueRow
          tooltip="You can borrow 80% of the staked balance"
          label="Borrowable Amount"
          value={<>{formatNumber(borrowingLimit)} dUSD</>}
        />
        <LabelValueRow
          tooltip="Annual percentage yield (APY)"
          label="Borrow APY"
          value={<>~5.2%</>}
        />
        <LabelValueRow
          tooltip="Borrow limit used"
          label="Borrow limit used"
          value={<>{formatNumber(currentBorrowingLimitUsed())}%</>}
        />
        <Separator />
        {debouncedValue && (
          //   <div className="bg-secondary rounded-lg px-2 py-2 mt-2">
          <LabelValueRow
            tooltip="Borrow change"
            label="Borrow"
            value={
              <>
                {formatNumber(totalBorrowedAmount)}
                <ArrowRight className="w-4 h-4 text-muted-foreground" />{" "}
                {formatNumber(
                  (parseFloat(totalBorrowedAmount) as any) +
                    parseFloat(debouncedValue || "0.00")
                )}
              </>
            }
          />
          //   </div>
        )}

        {/* <LabelValueRow
          label="Gas price"
          value={<>~${estimatedGasFees}</>}
          tooltip="amount required to conduct a transaction onchain"
        /> */}
        <Button
          type="submit"
          disabled={totalStakedAmount === "0.0"}
          variant={"invert"}
          loading={isLoading}
          className="w-full !mt-4"
        >
          Borrow dUSD 🚀
        </Button>
      </form>
    </div>
  );
};

export default Borrow;
