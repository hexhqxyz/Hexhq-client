import { BrowserProvider,JsonRpcSigner } from "ethers";
import { create } from "zustand";

type State = {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  isConnected: boolean;
  address: string | null;
};
type Action = {
  setProvider: (provider: BrowserProvider) => void;
  setSigner: (signer: JsonRpcSigner) => void;
  setIsConnected: (isConnected: boolean) => void;
  setAddress: (address:string) => void;
  reset: () => void;
};

const initialState: State = {
  provider: null,
  signer: null,
  isConnected: false,
  address: null,
};

export const useWeb3Store = create<State & Action>((set) => ({
  ...initialState,
  setProvider: (provider) => set({ provider }),
  setSigner: (signer) => set({ signer }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setAddress: (address) => set({ address }),
  reset: () => {
    set(initialState);
  },
}));
