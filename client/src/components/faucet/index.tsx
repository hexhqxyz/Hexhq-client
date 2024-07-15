"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Contract, ethers } from "ethers";
import { useWeb3Store } from "@/store/signer-provider-store";
import {
  FAUCET_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { decodeFaucetError } from "@/lib/utils";

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

      const maxFeePerGas = ethers.parseUnits("100", "gwei"); // 100 gwei
      const tx = await faucetContract.claimTokens({
        maxFeePerGas: maxFeePerGas,
      });
      const receipt = await tx.wait();
      console.log("receipt:", receipt);
      setLoading(false);
    } catch (error) {
      console.log("error:", error);
      console.log(decodeFaucetError(error))
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
