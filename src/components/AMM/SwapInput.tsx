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
import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: TOKEN_TYPE;
  className?: string;
  balance?: string;
  onSelectChange?: (val: string) => void;
  amount?: string;
  onAmountChange?: (val: string) => void;
  selectValue: TOKEN_TYPE;
  error?: FieldError | undefined;
  isSelectDisabled?: boolean;
}

const SwapInput = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      defaultValue,
      balance,
      onSelectChange,
      amount,
      isSelectDisabled=false,
      error,
      onAmountChange,
      selectValue,
      ...props
    },
    ref
  ) => {
    const tokenDetails = useTokenStore().tokenDetails;
    return (
      <div className="space-y-2 w-full">
        <div className={cn("rounded-xl pr-2 pt-2 pb-4 bg-secondary space-y-2 w-full ", className)}>
          <div className="flex items-center w-full">
            <div className="flex items-center rounded-md w-full">
              <input
                className={cn("bg-secondary text-3xl p-2 focus:outline-none ml-2 w-full disabled:cursor-not-allowed disabled:opacity-50", className)}
                placeholder="0.0"
                ref={ref}
                {...props}
              />
            </div>
            <div className="w-max justify-end flex">
              <Select
                defaultValue={defaultValue}
                value={selectValue}
                onValueChange={onSelectChange}
                disabled={isSelectDisabled || props.disabled}
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
          {error && (
            <p className="text-red-500 text-sm -mt-2 pl-4">{error.message}</p>
          )}

          <div className="flex justify-between items-center">
            <div></div>
            <Button
              variant={"ghost"}
              type="button"
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
