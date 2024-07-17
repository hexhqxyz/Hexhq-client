import { create } from "zustand";

type State = {
  totalApprovedAmount: string;
  totalStakedAmount: string;
};
type Action = {
  setTotalApprovedAmount: (amount:string) => void;
  setTotalStakedAmount: (amount:string) => void;
  reset: () => void;
};

const initialState: State = {
totalApprovedAmount: "0",
totalStakedAmount: "0",
};

export const useStakingStore = create<State & Action>((set) => ({
  ...initialState,
  setTotalApprovedAmount: (amount: string) => set({ totalApprovedAmount: amount }),
  setTotalStakedAmount: (amount: string) => set({ totalStakedAmount: amount }),
  reset: () => {
    set(initialState);
  },
}));
