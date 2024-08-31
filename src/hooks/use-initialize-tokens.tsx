import { useEffect } from "react";
import { Contract } from "ethers";

import {
  REWARD_TOKEN_ADDRESS,
  STAKING_TOKEN_CONTRACT_ADDRESS,
} from "@/lib/constants";
import STAKING_TOKEN_ABI from "@/lib/abis/StakingToken.json";
import REWARD_ABI from "@/lib/abis/RewardToken.json";
import { useWeb3Store } from "@/store/signer-provider-store";
import { useTokenStore } from "@/store/token-store";

const useInitializeTokens = () => {
  const { signer } = useWeb3Store();
  const {
    setStakingTokenContract,
    setRewardTokenContract,
    setAvailableStakingTokenBalance,
  } = useTokenStore();

  useEffect(() => {
    const initialize = async () => {
      console.log("initilazing....")
      if (!signer) return;
      console.log("after signer initializer....")

      const stakingTokenContract = new Contract(
        STAKING_TOKEN_CONTRACT_ADDRESS,
        STAKING_TOKEN_ABI.abi,
        signer
      );

      console.log("stakingTokenContract:", stakingTokenContract);

      const rewardTokenContract = new Contract(
        REWARD_TOKEN_ADDRESS,
        REWARD_ABI.abi,
        signer
      );

      setStakingTokenContract(stakingTokenContract);
      setRewardTokenContract(rewardTokenContract);
      setAvailableStakingTokenBalance();
    };

    initialize();
  }, [signer]);
};

export default useInitializeTokens;
