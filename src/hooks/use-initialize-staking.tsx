import { useEffect } from "react";
import { Contract } from "ethers";

import { STAKING_ADDRESS } from "@/lib/constants";
import STAKING_ABI from "@/lib/abis/Staking.json";
import { useStakingStore } from "@/store/staking-store";
import { useWeb3Store } from "@/store/signer-provider-store";

const useInitializeStaking = () => {
  const { signer } = useWeb3Store();
  const { setStakingContract } = useStakingStore();

  useEffect(() => {
    const initialize = async () => {
      if (!signer) return;

      const stakingContract = new Contract(
        STAKING_ADDRESS,
        STAKING_ABI.abi,
        signer
      );

      setStakingContract(stakingContract);
    };

    initialize();
  }, [signer]);
};

export default useInitializeStaking;
