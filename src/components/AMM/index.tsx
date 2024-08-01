import React from "react";
import VolumeChart from "./main/VolumeChart";
import { TVLChart } from "./main/TVLChart";

type Props = {};

const AMM = (props: Props) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="grid grid-cols-2 justify-center gap-8 ">
        <div className="min-w-max h-full">
          <VolumeChart />
        </div>
        <div className="w-full">
         <TVLChart />
        </div>
      </div>
    </div>
  );
};

export default AMM;
