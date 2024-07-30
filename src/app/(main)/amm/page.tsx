import PoolInfo from "@/components/AMM/main/PoolInfo";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="w-full flex flex-col items-center">
      <PoolInfo />
    </div>
  );
};

export default page;
