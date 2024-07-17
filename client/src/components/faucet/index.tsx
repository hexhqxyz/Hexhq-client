"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Contract, ethers, TransactionReceipt } from "ethers";
import { useWeb3Store } from "@/store/signer-provider-store";
import { FAUCET_CONTRACT_ADDRESS } from "@/lib/constants";
import { decodeFaucetError } from "@/lib/utils";
import { toast } from "sonner";

type Props = {};

const Faucet = (props: Props) => {
  const { contract, signer } = useWeb3Store();
  const [loading, setLoading] = useState(false);

  const handleFaucetClick = async () => {
    try {
      if (!contract) return;
      setLoading(true);

      const faucetAbi = await import("@/lib/abis/Faucet.json").then(
        (data) => data.abi
      );
      const faucetContract = new Contract(
        FAUCET_CONTRACT_ADDRESS,
        faucetAbi,
        signer
      );
      const maxPriorityFeePerGas = ethers.parseUnits("2", "gwei"); // 2 gwei

      const maxFeePerGas = ethers.parseUnits("100", "gwei"); // 100 gwei
      const tx = await faucetContract.claimTokens({
        maxFeePerGas: maxFeePerGas,
        // gasLimit: 100000, // Set a high enough gas limit
        // maxPriorityFeePerGas: maxPriorityFeePerGas,
      });

      const toastId = toast.loading(
        "Your DTX faucet tokens are on the way! This may take a few moments"
      );
      const receipt: TransactionReceipt = await tx.wait();
      console.log("receipt:", receipt)

      toast.success("Tokens Received!", {
        description:
          "Your DTX faucet tokens have been successfully transferred",
        action: {
          label: "See Tx",
          onClick: () => {
            window.open(
              `https://sepolia.etherscan.io/tx/${receipt?.hash}`
            );
          },
        },
        id: toastId,
      });

      setLoading(false);
    } catch (error) {
      console.log("error:", error);
      const parsedError = decodeFaucetError(error);
      toast.error(parsedError.title, {
        description: parsedError.description,
      });

      setLoading(false);
    }
  };
  return (
    <div>
      <Button
        className="w-full"
        onClick={handleFaucetClick}
        disabled={loading}
        loading={loading}
      >
        Send Me DTX
      </Button>
    </div>
  );
};

export default Faucet;
