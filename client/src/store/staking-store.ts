import { create } from "zustand";
import { useWeb3Store } from "./signer-provider-store";
import {
  STAKING_ADDRESS,
  STAKING_TOKEN_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { Contract, ethers, TransactionReceipt } from "ethers";
import STAKING_TOKEN_ABI from "@/lib/abis/StakingToken.json";
import STAKING_ABI from "@/lib/abis/Staking.json";

type State = {
  totalApprovedAmount: string;
  totalStakedAmount: string;
  stakingContract: Contract | null;
  stakingTokenContract: Contract | null;
};
type Action = {
  setTotalApprovedAmount: () => void;
  setTotalStakedAmount: () => void;
  setStakingContract: (contract: Contract) => void;
  setStakingTokenContract: (contract: Contract) => void;
  reset: () => void;
};

const initialState: State = {
  totalApprovedAmount: "0",
  totalStakedAmount: "0",
  stakingContract: null,
  stakingTokenContract: null,
};

export const useStakingStore = create<State & Action>((set, get) => ({
  ...initialState,
  setTotalStakedAmount: async () => {
    try {
      const { stakingContract } = get(); // Get the current state
      if (!stakingContract) return;
      const address = useWeb3Store.getState().address;
      const stakedBalance = await stakingContract.stakedBalance(address);
      const amount = ethers.formatUnits(stakedBalance, 18);
      set({ totalStakedAmount: amount });
    } catch (error) {
      console.log("error occured........", error);
    }
  },

  setTotalApprovedAmount: async () => {
    try {
      const address = useWeb3Store.getState().address;
      const { stakingTokenContract } = get(); // Get the current state
      if (!stakingTokenContract) return;

      const allowance = await stakingTokenContract.allowance(
        address,
        STAKING_ADDRESS
      );
      const amount = ethers.formatUnits(allowance, 18);

      set({ totalApprovedAmount: amount });
    } catch (error) {
      console.log("error occured........", error);
    }
  },
  setStakingContract(contract) {
    set({ stakingContract: contract });
  },
  setStakingTokenContract(contract) {
    set({ stakingTokenContract: contract });
  },
  reset: () => {
    set(initialState);
  },
}));
