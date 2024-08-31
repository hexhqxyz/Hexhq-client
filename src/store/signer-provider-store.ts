import { BrowserProvider,JsonRpcSigner } from "ethers";
import { create } from "zustand";

type State = {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
};
type Action = {
  setProvider: (provider: BrowserProvider) => void;
  setSigner: (signer: JsonRpcSigner) => void;
  setIsConnected: (isConnected: boolean) => void;
  setAddress: (address:string) => void;
  reset: () => void;
  setChainId: (chainId: number) => void;
};

const initialState: State = {
  provider: null,
  signer: null,
  chainId: null,
  isConnected: false,
  address: null,
};

export const useWeb3Store = create<State & Action>((set) => ({
  ...initialState,
  setProvider: (provider) => set({ provider }),
  setChainId: (chainId) => set({ chainId }),
  setSigner: (signer) => set({ signer }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setAddress: (address) => set({ address }),
  reset: () => {
    set(initialState);
  },
}));
