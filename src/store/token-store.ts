import { create } from "zustand";
import { Contract, ethers } from "ethers";

import { useWeb3Store } from "./signer-provider-store";
import { STAKING_ADDRESS } from "@/lib/constants";

type State = {
  tokenDetails: {
    atx: {
      name: string;
      symbol: string;
      totalSupply: string;
    };
    dusd: {
      name: string;
      symbol: string;
      totalSupply: string;
    };
  };
  availableStakingTokenBalance: string;
  availableRewardTokenBalance: string;
  totalApprovedAmount: string;

  stakingTokenContract: Contract | null;
  rewardTokenContract: Contract | null;
};
type Action = {
  setAvailableStakingTokenBalance: () => void;
  setStakingTokenContract: (contract: Contract) => void;
  setRewardTokenContract: (contract: Contract) => void;
  setTotalApprovedAmount: () => void;

  reset: () => void;
};

const initialState: State = {
  tokenDetails: {
    atx: {
      name: "Staking Token",
      symbol: "ATX",
      totalSupply: "100000",
    },
    dusd: {
      name: "Staking Rewards",
      symbol: "dUSD",
      totalSupply: "100000",
    },
  },
  availableStakingTokenBalance: "0",
  availableRewardTokenBalance: "0",
  totalApprovedAmount: "0",

  rewardTokenContract: null,
  stakingTokenContract: null,
};

export const useTokenStore = create<State & Action>((set, get) => ({
  ...initialState,
  setAvailableStakingTokenBalance: async () => {
    try {
      console.log("set available token balance...")
      const { stakingTokenContract, rewardTokenContract } = get();
      const address = useWeb3Store.getState().address;
      if (
        !stakingTokenContract ||
        !rewardTokenContract ||
        !address ||
        !ethers.isAddress(address)
      )
        return;
      console.log("address", address);

      const balance = await stakingTokenContract.balanceOf(address);
      const rewardBalance = await rewardTokenContract.balanceOf(address);
      const formattedBalance = ethers.formatUnits(balance, 18);
      const formattedRewardBalance = ethers.formatUnits(rewardBalance, 18);

      set({
        availableStakingTokenBalance: formattedBalance,
        availableRewardTokenBalance: formattedRewardBalance,
      });
    } catch (error) {
      console.log("error in the available token balance:", error);
    }
  },
  setStakingTokenContract(contract) {
    set({ stakingTokenContract: contract });
  },
  setRewardTokenContract(contract) {
    set({ rewardTokenContract: contract });
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

  // setTokenDetails: async () => {
  //   try {
  //     const { stakingTokenContract, rewardTokenContract } =
  //       useStakingStore.getState();
  //     if (!stakingTokenContract || !rewardTokenContract) return;

  //     const stakingTokenName = await stakingTokenContract.name();
  //     const rewardTokenName = await rewardTokenContract.name();
  //     const stakingTokenSymbol = await stakingTokenContract.symbol();
  //     const rewardTokenSymbol = await rewardTokenContract.symbol();
  //     const stakingTokenTotalSupply = await stakingTokenContract.totalSupply();
  //     const rewardTokenTotalSupply = await rewardTokenContract.totalSupply();

  //     const formattedStakingSupply = ethers.formatUnits(
  //       stakingTokenTotalSupply,
  //       18
  //     );
  //     const formattedRewardSupply = ethers.formatUnits(
  //       rewardTokenTotalSupply,
  //       18
  //     );

  //     set({
  //       tokenDetails: {
  //         atx: {
  //           name: stakingTokenName || "",
  //           symbol: stakingTokenSymbol || "",
  //           totalSupply: formattedStakingSupply || "0",
  //         },
  //         dusd: {
  //           name: rewardTokenName || "",
  //           symbol: rewardTokenSymbol || "",
  //           totalSupply: formattedRewardSupply || "0",
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     console.log("error in the available token balance:", error);
  //   }
  // },

  reset: () => {
    set(initialState);
  },
}));
