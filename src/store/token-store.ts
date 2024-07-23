import { create } from "zustand";
import { ethers } from "ethers";

import { useWeb3Store } from "./signer-provider-store";
import { useStakingStore } from "./staking-store";

type State = {
  availableStakingTokenBalance: string;
};
type Action = {
  setAvailableStakingTokenBalance: () => void;
  reset: () => void;
};

const initialState: State = {
  availableStakingTokenBalance: "0",
};

export const useTokenStore = create<State & Action>((set, get) => ({
  ...initialState,
  setAvailableStakingTokenBalance: async () => {
    try {
      const stakingTokenContract =
        useStakingStore.getState().stakingTokenContract;
      const address = useWeb3Store.getState().address;
      if (!stakingTokenContract || !address || !ethers.isAddress(address))
        return;
      console.log("address", address);

      const balance = await stakingTokenContract.balanceOf(address);
      const formattedBalance = ethers.formatUnits(balance, 18);

      set({ availableStakingTokenBalance: formattedBalance });
    } catch (error) {
      console.log("error in the available token balance:", error);
    }
  },

  reset: () => {
    set(initialState);
  },
}));
