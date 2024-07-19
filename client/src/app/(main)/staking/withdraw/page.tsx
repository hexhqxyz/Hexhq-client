import WithdrawAmount from "@/components/staking/WithdrawAmount";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="mx-auto max-w-lg">
      <div className="p-6">
        <WithdrawAmount />
      </div>
    </div>
  );
};

export default Page;
