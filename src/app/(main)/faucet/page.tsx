import Faucet from "@/components/faucet";
import { Heading } from "@/components/ui/Typography";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 dark:from-[#1e3a8a] dark:to-[#6b21a8]">
        <div className="bg-background px-10 pt-6 pb-4 rounded-xl shadow-xl max-w-lg w-full">
          <Heading variant="h2" className="text-center mb-4 mx-auto">
            STAKING DTX FAUCET
          </Heading>
          <div className="text-center mb-6">
            <p className="text-muted-foreground">
              Staking tokens (DTX):{" "}
              <span className="font-semibold">8 Staking DTX/day.</span>
            </p>
            <div className="mt-8">
              <Faucet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
