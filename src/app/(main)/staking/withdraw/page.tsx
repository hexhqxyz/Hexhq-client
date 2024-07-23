import WithdrawAmount from "@/components/staking/WithdrawAmount";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="mx-auto lg::max-w-lg w-full ">
      <div className="p-4">
        <WithdrawAmount />
      </div>
    </div>
  );
};

export default Page;
