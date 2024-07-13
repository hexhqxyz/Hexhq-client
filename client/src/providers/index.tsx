import { Web3Modal } from "@/context/web3modal";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  return (
    <div>
      <Web3Modal>{children}</Web3Modal>
    </div>
  );
};

export default Providers;
