import { create } from "zustand";
import { Contract, ethers } from "ethers";

type State = {
  ammContract: Contract | null;
};
type Action = {
  setAmmContract: (contract: Contract) => void;

  reset: () => void;
};

const initialState: State = {
  ammContract: null,
};

export const useAmmStore = create<State & Action>((set) => ({
  ...initialState,
  setAmmContract(contract) {
    set({ ammContract: contract });
  },

  reset: () => {
    set(initialState);
  },
}));
