import { Web3Modal } from "@/context/web3modal";
import React from "react";
import { ThemeProvider } from "./theme-provider";
import { ApolloProvider } from "./apollo-provider";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  return (
    <div>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <Web3Modal>
          <ApolloProvider>{children}</ApolloProvider>
        </Web3Modal>
      </ThemeProvider>
    </div>
  );
};

export default Providers;
