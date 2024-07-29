import { useEffect } from "react";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider } from "ethers";
import { useWeb3Store } from "@/store/signer-provider-store";
import useInitializeTokens from "./use-initialize-tokens";

const useInitializeWeb3 = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const { isConnected, chainId, status, address } = useWeb3ModalAccount();
  const { setProvider, setSigner, setIsConnected, reset, setAddress } =
    useWeb3Store();
  useInitializeTokens();

  useEffect(() => {
    const initialize = async () => {
      if (status === "disconnected") {
        reset();
      }
      if (
        !walletProvider ||
        !address ||
        !isConnected ||
        !chainId ||
        ![1337, 1, 11155111].includes(chainId)
      )
        return;

      const ethersProvider = new BrowserProvider(walletProvider);
      setProvider(ethersProvider);

      const signer = await ethersProvider.getSigner();
      setSigner(signer);
      setAddress(address as string);

      setIsConnected(true);
    };

    initialize();
  }, [walletProvider, setProvider, setSigner, setIsConnected, status]);
};

export default useInitializeWeb3;
