import { Contract,BrowserProvider,JsonRpcSigner } from "ethers";
import { create } from "zustand";

type State = {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  contract: Contract | null;
  isConnected: boolean;
};
type Action = {
  setProvider: (provider: BrowserProvider) => void;
  setSigner: (signer: any) => void;
  setContract: (contract: Contract) => void;
  setIsConnected: (isConnected: boolean) => void;
  reset: () => void;
};

const initialState: State = {
  provider: null,
  signer: null,
  contract: null,
  isConnected: false,
};

export const useWeb3Store = create<State & Action>((set) => ({
  ...initialState,
  setProvider: (provider: BrowserProvider) => set({ provider }),
  setSigner: (signer: any) => set({ signer }),
  setContract: (contract: Contract) => set({ contract }),
  setIsConnected: (isConnected: boolean) => set({ isConnected }),
  reset: () => {
    set(initialState);
  },
}));
