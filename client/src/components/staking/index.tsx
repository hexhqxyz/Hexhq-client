import React from "react";
import ApproveToken from "./ApproveToken";
import StakeAmount from "./StakeAmount";
import { Separator } from "../ui/separator";

type Props = {};

const Staking = (props: Props) => {
  return (
    <div className="mx-auto max-w-lg">
      <div className="p-6">
        <StakeAmount />
      </div>
      <div className="mt-6">
        <Separator />
      </div>
      <div className="p-6">
        <ApproveToken />
      </div>
    </div>
  );
};

export default Staking;
