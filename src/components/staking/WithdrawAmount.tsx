"use client";

import React, { useEffect } from "react";
import { ethers, TransactionReceipt } from "ethers";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CryptoInput, Input } from "../ui/input";
import { Heading } from "../ui/Typography";
import { Label, LabelValueRow } from "../ui/label";
import { Button } from "../ui/button";

import { useStakingStore } from "@/store/staking-store";
import { ApproveTokenSchema } from "@/lib/zod-validation";
import { formatNumber } from "@/lib/utils";
import { decodeStakingError } from "@/lib/decodeError";
import { BLOCK_EXPLORER } from "@/lib/constants";

type Props = {};

type FormData = {
  amount: string;
};

const WithdrawAmount = (props: Props) => {
  const { setTotalStakedAmount, totalStakedAmount, stakingContract } =
    useStakingStore();
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
    if (parseFloat(data.amount) > parseFloat(totalStakedAmount)) {
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
      const toastId = toast.loading(
        "Your DTX is being withdrawn! This may take a few moments"
      );

      console.log("tx:", tx);

      const receipt: TransactionReceipt = await tx.wait();
      console.log("receipt:", receipt);
      toast.success("Successfully Withdrawn!", {
        description: "Your DTX tokens have been successfully withdrawn",
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
      setTotalStakedAmount();
      setDebouncedValue("");
    } catch (error) {
      toast.dismiss();
      const parsedError = await decodeStakingError(error);
      toast.error(parsedError.title, {
        description: parsedError.description || "",
      });

      setIsLoading(false);
      console.log("error:", error);
    }
  });

  const handlePricePercentClick = (percent: number) => {
    const amount = (Number(totalStakedAmount) * percent) / 100;
    setValue("amount", amount.toString());
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
      <Heading variant="h3" className="mb-1">
        Withdraw amount
      </Heading>
      <p className="mb-4 text-sm text-muted-foreground">
  Withdraw your staked DTX tokens by entering the amount and clicking Withdraw. Track your staked amount in real-time.
</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <CryptoInput
          onMaxClick={() => {
            handlePricePercentClick(100);
          }}
          disabled={isLoading}
          error={errors.amount}
          {...register("amount")}
          label="How much DTX do you want to withdraw?"
        />
        <div className="grid grid-cols-4 gap-x-4 text-sm !mt-3">
          {[25, 50, 75, 100].map((item, index) => (
            <Button
              size={"sm"}
              variant={"secondary"}
              type="button"
              key={item}
              onClick={() => handlePricePercentClick(item)}
              className="text-center rounded-2xl cursor-pointer"
            >
              {item}%
            </Button>
          ))}
        </div>
        <LabelValueRow
          tooltip="You can withdraw 100% of the staked balance (your balance will be locked if you have used your staked balance as colletral)"
          label="Withdrawable amount"
          value={<>{formatNumber(totalStakedAmount)} DTX</>}
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
                    parseFloat(totalStakedAmount) - parseFloat(debouncedValue)
                  ) || "0.0"}
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
          Withdraw 🙏
        </Button>
      </form>
    </div>
  );
};

export default WithdrawAmount;
