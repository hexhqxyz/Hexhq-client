import AMM from "@/components/AMM";
import PoolInfo from "@/components/AMM/main/PoolInfo";
import AmmTransactions from "@/components/AMM/transactions";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="w-full flex flex-col items-center">
      <PoolInfo />
      <div className="mt-6 w-full">
        <AMM />
      </div>
      <div className="mt-5 w-full">
        <AmmTransactions />
      </div>
    </div>
  );
};

export default page;
