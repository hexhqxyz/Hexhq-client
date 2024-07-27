"use client";

import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Label } from "../ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTokenStore } from "@/store/token-store";
import { WalletIcon } from "lucide-react";
import { TOKEN_TYPE } from "@/lib/types";

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: TOKEN_TYPE;
  className?: string;
  balance?: string;
  onSelectChange?: (val: string) => void;
  amount?: string;
  onAmountChange?: (val: string) => void;
  selectValue: TOKEN_TYPE;
}

const SwapInput = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      defaultValue,
      balance,
      onSelectChange,
      amount,
      onAmountChange,
      selectValue,
      ...props
    },
    ref
  ) => {
    const tokenDetails = useTokenStore().tokenDetails;
    return (
      <div className="space-y-2">
        <div className="rounded-xl pr-2 pt-2 pb-4 bg-secondary space-y-2 ">
          <div className="flex items-center">
            <div className="flex items-center rounded-md">
              <input
                className="bg-secondary text-3xl p-2 focus:outline-none ml-2 w-full disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="0.0"
                ref={ref}
                {...props}
              />
            </div>
            <div className="">
              <Select
                defaultValue={defaultValue}
                value={selectValue}
                onValueChange={onSelectChange}
              >
                <SelectTrigger className="w-max">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value={tokenDetails.dtx.symbol}
                    className="justify-start"
                  >
                    <div className="flex items-center gap-x-2">
                      <Image
                        width={20}
                        height={20}
                        src="/dtx-token.svg"
                        alt="icon"
                      />
                      {tokenDetails.dtx.symbol}
                    </div>
                  </SelectItem>
                  <SelectItem
                    value={tokenDetails.dusd.symbol}
                    className="justify-start"
                  >
                    <div className="flex items-center gap-x-2">
                      <Image
                        width={20}
                        height={20}
                        src="/dtx-token.svg"
                        alt="icon"
                      />
                      {tokenDetails.dusd.symbol}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div></div>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="items-center gap-x-2 text-muted-foreground"
            >
              <WalletIcon className=" w-5 h-5" />
              {balance}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

SwapInput.displayName = "SwapInput";

export { SwapInput };
