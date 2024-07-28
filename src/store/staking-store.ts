import { create } from "zustand";
import { Contract, ethers } from "ethers";

import { useWeb3Store } from "./signer-provider-store";

type State = {
  stakingDetails: {
    totalStaked: string;
    totalBorrowed: string;
    lastUpdated: string;
    interestRate: string;
  };
  userDetails: {
    borrowedAmount: string; // how much user has borrowed
    borrowLimit: string; // how much user can borrow
    repayAmount: string; // how much user need to repay
    interestPayable: string; // how much interest user needs to pay
    maxBorrow: string; // 80%
  };
  totalBorrowedAmount: string;
  totalStakedAmount: string;
  stakingContract: Contract | null;
  totalRewardsEarned: string;
};
type Action = {
  setTotalStakedAmount: () => void;
  setTotalBorrowedAmount: () => void;
  setStakingContract: (contract: Contract) => void;
  setTotalRewardsEarned: (val: string) => void;
  setStakingDetails: () => void;
  setUserDetails: () => void;
  reset: () => void;
};

const initialState: State = {
  totalBorrowedAmount: "0",
  totalStakedAmount: "0",
  totalRewardsEarned: "0",
  stakingDetails: {
    totalStaked: "0",
    lastUpdated: "0",
    interestRate: "0",
    totalBorrowed: "0",
  },
  userDetails: {
    borrowedAmount: "0",
    borrowLimit: "0",
    repayAmount: "0",
    interestPayable: "0",
    maxBorrow: "0",
  },
  stakingContract: null,
};

export const useStakingStore = create<State & Action>((set, get) => ({
  ...initialState,
  setStakingDetails: async () => {
    try {
      const { stakingContract } = get();
      if (!stakingContract) return;
      
      const totalStaked = await stakingContract.totalStakedTokens();
      const totalBorrowed = await stakingContract.totalBorrowedAmount();
      // console.log("total staked.........", totalStaked)
      const lastUpdated = await stakingContract.lastUpdateTime();
      const interestRate = await stakingContract.interestRate();
      console.log("here...", )
      console.log("interest rate.............", interestRate);

      set({
        stakingDetails: {
          totalStaked: ethers.formatUnits(totalStaked, 18),
          totalBorrowed: ethers.formatUnits(totalBorrowed, 18),
          lastUpdated: new Date(Number(lastUpdated) * 1000).toISOString(),
          interestRate: interestRate.toString(),
        },
      });
    } catch (error) {
      console.log("Error fetching staking details: ", error);
    }
  },
  setUserDetails: async () => {
    try {
      const { stakingContract } = get();
      if (!stakingContract) return;

      const address = useWeb3Store.getState().address;

      const borrowedAmount = await stakingContract.borrowedAmount(address);
      const borrowLimit = await stakingContract.calculateBorrowLimit(address);
      const repayAmount = await stakingContract.calculateRepayAmount(address);
      const interestPayable = await stakingContract.calculateInterest(address);
      // const maxBorrow = ethers.formatUnits(
      //   (await stakingContract.stakedBalance(address)).mul(80).div(100),
      //   18
      // );

      set({
        userDetails: {
          borrowedAmount: ethers.formatUnits(borrowedAmount, 18),
          borrowLimit: ethers.formatUnits(borrowLimit, 18),
          repayAmount: ethers.formatUnits(repayAmount, 18),
          interestPayable: ethers.formatUnits(interestPayable, 18),
          maxBorrow: "80",
        },
      });
    } catch (error) {
      console.log("Error fetching user details: ", error);
    }
  },
  setTotalRewardsEarned: (amount) => set({ totalRewardsEarned: amount }),
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
  setTotalBorrowedAmount: async () => {
    try {
      const { stakingContract } = get(); // Get the current state
      if (!stakingContract) return;
      const address = useWeb3Store.getState().address;
      const stakedBalance = await stakingContract.borrowedAmount(address);
      const amount = ethers.formatUnits(stakedBalance, 18);
      set({ totalBorrowedAmount: amount });
    } catch (error) {
      console.log("error occured........", error);
    }
  },


  setStakingContract(contract) {
    set({ stakingContract: contract });
  },
  reset: () => {
    set(initialState);
  },
}));
