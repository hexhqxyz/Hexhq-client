"use client";

import React, { useEffect, useState } from "react";
import { Heading } from "@/components/ui/Typography";
import PercentageSlider from "../PercentageSlider";
import { Button } from "@/components/ui/button";
import { useDebounceValue } from "usehooks-ts";
import { Label, LabelValueRow } from "@/components/ui/label";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import InfoCard from "@/components/ui/InfoCard";
import Image from "next/image";
import { useTokenStore } from "@/store/token-store";
import { useAmmStore } from "@/store/amm-store";
import { formatNumber, formatNumberSmall } from "@/lib/utils";
import { ArrowDown } from "lucide-react";

type Props = {};

const RemoveLiquidity = (props: Props) => {
  const tokenDetails = useTokenStore().tokenDetails;
  const { priceToken1InToken2, priceToken2InToken1 } = useAmmStore();

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
    <div className="space-y-4 p-2">
      <Card className="px-4 py-2 space-y-8">
      <Heading variant="h4">Remove amount</Heading>
        <CardContent className="p-0 space-y-8">
          <Heading variant="h5" className="text-5xl">
            {sliderValue}%
          </Heading>
          <div className="space-y-6">
            <PercentageSlider
              defaultValue={0}
              value={sliderValue}
              onValueChange={(val) => {
                setSliderValue(val[0]);
                setDebouncedSliderValue(val[0]);
              }}
            />

            <div>
              <div className="grid grid-cols-4 gap-x-4 text-sm">
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
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <ArrowDown className="text-muted-foreground w-5 h-5" />
      </div>
      <Card className="px-4 py-2 space-y-4">
        <Heading variant="h4">You&apos;ll receive </Heading>
        <CardContent className="p-0 space-y-2">
          <LabelValueRow
            label={
              <Heading className="text-primary">
                {" "}
                {debouncedSliderValue > 0 ? "23" : "-"}{" "}
              </Heading>
            }
            value={
              <>
                <div className="flex items-center gap-x-2 text-xl text-primary font-semibold">
                  <Image
                    width={20}
                    height={20}
                    src="/dtx-token.svg"
                    alt="icon"
                  />
                  {tokenDetails.dtx.symbol}
                </div>
              </>
            }
          />
          <LabelValueRow
            label={
              <Heading className="text-primary">
                {" "}
                {debouncedSliderValue > 0 ? "23" : "-"}{" "}
              </Heading>
            }
            value={
              <>
                <div className="flex items-center gap-x-2 text-xl text-primary font-semibold">
                  <Image
                    width={20}
                    height={20}
                    src="/dtx-token.svg"
                    alt="icon"
                  />
                  {tokenDetails.dusd.symbol}
                </div>
              </>
            }
          />
        </CardContent>
      </Card>

      <LabelValueRow
        label="Price:"
        value={
          <div>
            <p>1 DTX = {parseFloat(priceToken1InToken2).toFixed(4)} dUSD</p>
            <p>1 dUSD = {parseFloat(priceToken2InToken1).toFixed(4)} DTX</p>
          </div>
        }
      />
      <Button type="submit" variant={"invert"} className="w-full">
        Remove Liquidity 🙋
      </Button>
    </div>
  );
};

export default RemoveLiquidity;
