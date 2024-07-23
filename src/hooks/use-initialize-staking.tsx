import { useEffect } from "react";
import { Contract } from "ethers";

import {
  REWARD_TOKEN_ADDRESS,
STAKING_ADDRESS,
  STAKING_TOKEN_CONTRACT_ADDRESS,
} from "@/lib/constants";
import STAKING_TOKEN_ABI from "@/lib/abis/StakingToken.json";
import STAKING_ABI from "@/lib/abis/Staking.json";
import REWARD_ABI from "@/lib/abis/RewardToken.json";
import { useStakingStore } from "@/store/staking-store";
import { useWeb3Store } from "@/store/signer-provider-store";

const useInitializeStaking = () => {
  const { signer } = useWeb3Store();
  const { setStakingContract, setStakingTokenContract,setRewardTokenContract } = useStakingStore();

  useEffect(() => {
    const initialize = async () => {
      if (!signer) return;
      
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

      const rewardTokenContract = new Contract(
        REWARD_TOKEN_ADDRESS,
        REWARD_ABI.abi,
        signer
      );

      setStakingContract(stakingContract);
      setStakingTokenContract(stakingTokenContract);
      setRewardTokenContract(rewardTokenContract)
    };

    initialize();
  }, [signer]);
};

export default useInitializeStaking;
