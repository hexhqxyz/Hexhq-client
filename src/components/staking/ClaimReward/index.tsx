"use client";

import * as React from "react";
import { Gift } from "lucide-react";
import { ethers, TransactionReceipt } from "ethers";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { useStakingStore } from "@/store/staking-store";
import { decodeStakingError } from "@/lib/decodeError";
import { fireConfetti } from "@/lib/utils/confetti";
import { BLOCK_EXPLORER } from "@/lib/constants";

export default function ClaimReward() {
  const [open, setOpen] = React.useState(false);
  const { stakingContract, totalRewardsEarned } = useStakingStore();
  const [loading, setLoading] = React.useState(false);
  const handleRewardClaim = async () => {
    if (parseFloat(totalRewardsEarned) <= 0 || !stakingContract) return;
    setLoading(true);
    try {
      const maxFeePerGas = ethers.parseUnits("100", "gwei"); // 100 gwei
      const tx = await stakingContract.getReward({
        maxFeePerGas: maxFeePerGas,
      });
      const toastId = toast.loading(
        "Your rewared dUSD balance is being sent to your wallet address! This may take a few moments"
      );

      const receipt: TransactionReceipt = await tx.wait();
      console.log("receipt:", receipt);
      toast.success("Successfully Claimed reward!", {
        description:
          "Your dUSD tokens have been successfully sent to your wallet address",
        action: {
          label: "See Tx",
          onClick: () => {
            window.open(`${BLOCK_EXPLORER}/tx/${receipt?.hash}`);
          },
        },
        id: toastId,
      });

      fireConfetti();
      setOpen(false);
    } catch (error) {
      console.log("error:", error);
      toast.dismiss();
      const parsedError = await decodeStakingError(error);
      toast.error(parsedError.title, {
        description: parsedError.description || "",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild disabled={parseFloat(totalRewardsEarned) <= 0}>
        <Button
          variant="invert"
          className="bg-teal-500 hover:border-teal-500 gap-x-2 items-center"
        >
          Claim Reward <Gift className="w-4 h-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full py-20 max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Claim Reward</DrawerTitle>
            <DrawerDescription>
              claim your reward in just one click.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <div className="flex-1 text-center">
                <div className="text-4xl font-bold tracking-tighter">
                  {totalRewardsEarned} dUSD*
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  Updated every 40 seconds
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button loading={loading} onClick={handleRewardClaim}>
              {loading ? "Claiming..." : "Claim reward now ❣️"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
