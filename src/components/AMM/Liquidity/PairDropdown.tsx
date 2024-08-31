"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TOKEN_TYPE } from "@/lib/types";
import { useTokenStore } from "@/store/token-store";
import Image from "next/image";
import React from "react";

type Props = {
  defaultValue: TOKEN_TYPE;
  value: TOKEN_TYPE;
  onValueChange: (val: string) => void;
};

const PairDropdown = ({ defaultValue, onValueChange, value }: Props) => {
  const tokenDetails = useTokenStore().tokenDetails;
  return (
    <div className="w-full">
      <Select
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue className="w-full" placeholder="Select token" />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectItem value={tokenDetails.atx.symbol} className="justify-start">
            <div className="flex items-center gap-x-2 w-full">
              <Image width={20} height={20} src="/atx-token.svg" alt="icon" />
              <span className="font-semibold text-base">
                {tokenDetails.atx.symbol}
              </span>
            </div>
          </SelectItem>
          <SelectItem
            value={tokenDetails.dusd.symbol}
            className="justify-start"
          >
            <div className="flex items-center gap-x-2">
              <Image width={20} height={20} src="/dusd-token.svg" alt="icon" />
              <span className="font-semibold text-base">
                {tokenDetails.dusd.symbol}
              </span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PairDropdown;
