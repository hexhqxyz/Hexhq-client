import { create } from "zustand";
import { Contract, ethers } from "ethers";

type State = {
  ammContract: Contract | null;
  priceToken1InToken2: string;
  priceToken2InToken1:string;
};
type Action = {
  setAmmContract: (contract: Contract) => void;
  setCurrentTokenPrices: () => void;

  reset: () => void;
};

const initialState: State = {
  ammContract: null,
  priceToken1InToken2: "0",
  priceToken2InToken1: "0"
};

export const useAmmStore = create<State & Action>((set, get) => ({
  ...initialState,
  setAmmContract(contract) {
    set({ ammContract: contract });
  },
  async setCurrentTokenPrices() {
    try {
      const ammContract = get().ammContract;
      if (!ammContract) return;

      const [priceToken1InToken2, priceToken2InToken1] =
        await ammContract.getCurrentPrices();

      const formattedATXPrice = ethers.formatUnits(priceToken1InToken2, 18);
      const formattedDUSDPrice = ethers.formatUnits(priceToken2InToken1, 18);

      set({
        priceToken1InToken2: formattedATXPrice,
        priceToken2InToken1: formattedDUSDPrice
      });
    } catch (error) {
      console.error("Error fetching token prices:", error);
    }
  },
  reset: () => {
    set(initialState);
  },
}));
