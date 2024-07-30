"use client";

import * as React from "react";
import { SliderProps } from "@radix-ui/react-slider";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Slider } from "@/components/ui/slider";

interface TemperatureSelectorProps {
  defaultValue: number;
  onValueChange: (val: number[]) => void;
  value: number;
  disabled?: boolean;
}

export default function PercentageSlider({
  defaultValue,
  value,
  onValueChange,
  disabled,
}: TemperatureSelectorProps) {
  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <Slider
            disabled={disabled}
            id="temperature"
            max={100}
            min={0}
            defaultValue={[defaultValue]}
            value={[value]}
            step={1}
            onValueChange={onValueChange}
            className="hover:[&_[role=slider]]:h-6 hover:[&_[role=slider]]:w-6"
            aria-label="Temperature"
          />
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          Select the percentage of liquidity you want to remove by using the
          slider or preset percentage
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
