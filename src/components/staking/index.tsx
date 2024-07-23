import React from "react";

import ApproveToken from "./ApproveToken";
import StakeAmount from "./StakeAmount";
import { Separator } from "../ui/separator";

type Props = {};

const Staking = (props: Props) => {
  return (
    <div className="mx-auto lg::max-w-lg w-full ">
      <div className="p-4">
        <StakeAmount />
      </div>
      {/* <div className="mt-6">
        <Separator />
      </div> */}
      {/* <div className="p-4">
        <ApproveToken />
      </div> */}
    </div>
  );
};

export default Staking;
