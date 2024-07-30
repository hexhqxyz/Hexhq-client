"use client";

import React, { useEffect, useState } from "react";
import { Heading } from "@/components/ui/Typography";
import PercentageSlider from "../PercentageSlider";
import { Button } from "@/components/ui/button";
import { useDebounceValue } from "usehooks-ts";

type Props = {};

const RemoveLiquidity = (props: Props) => {
  const [debouncedSliderValue, setDebouncedSliderValue] = useDebounceValue(
    0,
    200
  );
  const [sliderValue, setSliderValue] = useState(0);
  const handlePresetPercentClick = (val: number) => {
    setSliderValue(val);
    setDebouncedSliderValue(val);
  };

  useEffect(() => {
    console.log("debounced slider value effect:", debouncedSliderValue);
  }, [debouncedSliderValue]);

  return (
    <div>
      <Heading className="text-8xl">{sliderValue}%</Heading>
      <PercentageSlider
        defaultValue={0}
        value={sliderValue}
        onValueChange={(val) => {
          setSliderValue(val[0]);
          setDebouncedSliderValue(val[0]);
        }}
      />

      <div>
        <div className="grid grid-cols-4 gap-x-4 text-sm !mt-3">
          {[25, 50, 75, 100].map((item, index) => (
            <Button
              size={"sm"}
              type="button"
              variant={"secondary"}
              key={item}
              className="text-center cursor-pointer rounded-2xl"
              onClick={() => handlePresetPercentClick(item)}
            >
              {item}%
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RemoveLiquidity;
