import { create } from "zustand";
import {ethers} from "ethers";

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
    const stakingTokenContract =
      useStakingStore.getState().stakingTokenContract;
    const address = useWeb3Store.getState().address;
    if (!stakingTokenContract || !address) return;

    const balance = await stakingTokenContract.balanceOf(address);
    const formattedBalance = ethers.formatUnits(balance, 18);

    set({ availableStakingTokenBalance: formattedBalance });
  },

  reset: () => {
    set(initialState);
  },
}));
