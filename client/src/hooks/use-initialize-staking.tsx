import { useEffect } from "react";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
// import { USDTAddress, USDTAbi } from './config'; // Replace with your actual contract address and ABI
import { useWeb3Store } from "@/store/signer-provider-store";
import {
  STAKING_ADDRESS,
  STAKING_TOKEN_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { Contract } from "ethers";

import STAKING_TOKEN_ABI from "@/lib/abis/StakingToken.json";
import STAKING_ABI from "@/lib/abis/Staking.json";
import { useStakingStore } from "@/store/staking-store";

const useInitializeStaking = () => {
  const { signer } = useWeb3Store();
  const { setStakingContract, setStakingTokenContract } = useStakingStore();

  useEffect(() => {
    const initialize = async () => {
      if (!signer) return;
      console.log("calling again... in useInitializeStaking");

      const stakingContract = new Contract(
        STAKING_ADDRESS,
        STAKING_ABI.abi,
        signer
      );

      const stakingTokenContract = new Contract(
        STAKING_TOKEN_CONTRACT_ADDRESS,
        STAKING_TOKEN_ABI.abi,
        signer
      );

      setStakingContract(stakingContract);
      setStakingTokenContract(stakingTokenContract);
    };

    initialize();
  }, [signer]);
};

export default useInitializeStaking;
