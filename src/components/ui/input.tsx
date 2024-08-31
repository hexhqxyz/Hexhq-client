import * as React from "react";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./button";
import { Label } from "./label";
import { FieldError } from "react-hook-form";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface CryptoInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  btnText?: string;
  label?: string;
  error?: FieldError | undefined;
  disabled?: boolean;
  onMaxClick: () => void;
}

const CryptoInput = React.forwardRef<HTMLInputElement, CryptoInputProps>(
  ({ className, type = "text", btnText,label, error, onMaxClick,disabled, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <div className="">
          <Label htmlFor="amount">{label}</Label>
        </div>
        <div className="flex items-center bg-secondary p-2 rounded-md">
          <div className="flex items-center justify-center bg-blue-600 rounded-full">
            <Image width={30} height={30} src="/atx-token.svg" alt="icon" />
          </div>
          <input
            type={type}
            className="bg-secondary text-xl p-2 focus:outline-none ml-2 w-full disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="0.00"
            ref={ref}
            disabled={disabled}
            {...props}
          />
          <Button
            variant={"default"}
            disabled={disabled}
            type="button"
            size={"sm"}
            onClick={onMaxClick}
            className="p-2 rounded-md ml-2"
          >
            {btnText || "MAX"}
          </Button>
        </div>
        <div className="">
          {error && (
            <p className="text-red-500 text-sm -mt-2 pl-0.5">{error.message}</p>
          )}
        </div>
      </div>
    );
  }
);

CryptoInput.displayName = "CryptoInput";

export { Input, CryptoInput };
