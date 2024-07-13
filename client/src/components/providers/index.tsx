import { Web3Modal } from "@/context/web3modal";
import React from "react";
import { ThemeProvider } from "./theme-provider";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  return ( 
    <div>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Web3Modal>{children}</Web3Modal>
      </ThemeProvider>
    </div>
  );
};

export default Providers;
