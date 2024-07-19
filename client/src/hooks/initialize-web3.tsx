import { useEffect } from "react";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract } from "ethers";
// import { USDTAddress, USDTAbi } from './config'; // Replace with your actual contract address and ABI
import { useWeb3Store } from "@/store/signer-provider-store";

const USDTAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const USDTAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address addr) view returns (uint)",
  "function transfer(address to, uint amount)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

const useInitializeWeb3 = () => {
    // console.log("calling again... in useInitializeWeb3")
  const { walletProvider } = useWeb3ModalProvider();
  const { isConnected,chainId,status,address } = useWeb3ModalAccount();
  const { setProvider, setSigner, setContract, setIsConnected,reset,setAddress } =
    useWeb3Store();

  useEffect(() => {
    const initialize = async () => {
      if(status === "disconnected") {
        console.log("disconnected..., resetting the store")
        reset();
      }
      if (!walletProvider || !address || !isConnected || !chainId ||  ![1337,1,11155111].includes(chainId)) return;
      console.log("calling again... in useInitializeWeb3")

      const ethersProvider = new BrowserProvider(walletProvider);
      setProvider(ethersProvider);

      const signer = await ethersProvider.getSigner();
      setSigner(signer);
      setAddress(address as string);

      const USDTContract = new Contract(USDTAddress, USDTAbi, signer);
      setContract(USDTContract);

      setIsConnected(true);
    };

    initialize();
  }, [walletProvider, setProvider, setSigner, setContract, setIsConnected,status]);
};

export default useInitializeWeb3;
