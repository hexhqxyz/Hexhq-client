import { create } from "zustand";
import { ethers } from "ethers";

import { useWeb3Store } from "./signer-provider-store";
import { useStakingStore } from "./staking-store";

type State = {
  tokenDetails: {
    dtx: {
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
};
type Action = {
  setAvailableStakingTokenBalance: () => void;
  // setTokenDetails: () => void;
  reset: () => void;
};

const initialState: State = {
  tokenDetails: {
    dtx: {
      name: "Staking Token",
      symbol: "DTX",
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
};

export const useTokenStore = create<State & Action>((set, get) => ({
  ...initialState,
  setAvailableStakingTokenBalance: async () => {
    try {
      const { stakingTokenContract, rewardTokenContract } =
        useStakingStore.getState();
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
  //         dtx: {
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
