import Faucet from "@/components/faucet";
import { Heading } from "@/components/ui/Typography";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <div>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-background px-10 pt-6 pb-4 rounded-xl shadow-xl max-w-lg w-full border">
          <Heading variant="h2" className="text-center mb-4 mx-auto">
            STAKING ATX FAUCET
          </Heading>
          <div className="text-center mb-6">
            <p className="text-muted-foreground">
              Staking tokens (ATX):{" "}
              <span className="font-semibold">10 Staking ATX/day.</span>
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
