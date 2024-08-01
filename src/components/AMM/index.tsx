import React from "react";
import VolumeChart from "./main/VolumeChart";
import { TVLChart } from "./main/TVLChart";

type Props = {};

const AMM = (props: Props) => {
  return (
    <div className="lg:flex flex-col justify-center items-center">
      <div className="lg:grid grid-cols-2 justify-center gap-8 ">
        <div className="lg:min-w-max h-full">
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
