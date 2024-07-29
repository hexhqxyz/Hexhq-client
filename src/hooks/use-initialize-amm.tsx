import { useEffect } from "react";
import { Contract } from "ethers";

import { AMM_CONTRACT_ADDRESS } from "@/lib/constants";
import AMM_ABI from "@/lib/abis/AMM.json";
import { useWeb3Store } from "@/store/signer-provider-store";
import { useAmmStore } from "@/store/amm-store";

const useInitializeAmm = () => {
  const { signer } = useWeb3Store();
  const setAmmContract = useAmmStore().setAmmContract;

  useEffect(() => {
    const initialize = async () => {
      if (!signer) return;

      const ammContract = new Contract(
        AMM_CONTRACT_ADDRESS,
        AMM_ABI.abi,
        signer
      );

      setAmmContract(ammContract);
    };

    initialize();
  }, [signer]);
};

export default useInitializeAmm;
