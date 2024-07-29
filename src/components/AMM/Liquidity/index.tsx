"use client";

import React, { useState } from "react";
import PairDropdown from "./PairDropdown";
import { TOKEN_TYPE } from "@/lib/types";
import { LabelValueRow } from "@/components/ui/label";
import { SwapInput } from "../SwapInput";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

type Props = {};

const ProvideLiquidity = (props: Props) => {
  const [fromToken, setFromToken] = useState<TOKEN_TYPE>("DTX");
  const [toToken, setToToken] = useState<TOKEN_TYPE>("dUSD");

  const handleTokenChange = (
    field: "fromToken" | "toToken",
    value: TOKEN_TYPE
  ) => {
    if (field === "fromToken") {
      setFromToken(value);
      setToToken(value === "DTX" ? "dUSD" : "DTX");
    } else {
      setToToken(value);
      setFromToken(value === "DTX" ? "dUSD" : "DTX");
    }
  };

  return (
    <div>
      <div className="py-2 space-y-2">
        <LabelValueRow
          className="ml-1"
          label="Select pair"
          tooltip="Which token pair would you like to add liquidity to."
        />
        <div className="grid lg:grid-cols-2 gap-4 items-center w-full">
          <PairDropdown
            defaultValue="DTX"
            onValueChange={(value: any) =>
              handleTokenChange("fromToken", value)
            }
            value={fromToken}
          />
          <PairDropdown
            defaultValue="dUSD"
            onValueChange={(value: any) => handleTokenChange("toToken", value)}
            value={toToken}
          />
        </div>
      </div>

      <div className="space-y-2 py-2">
        <LabelValueRow
          className="ml-1"
          label="Deposit amounts"
          tooltip="Depending on your range, the supplied tokens for this position will not always be a 50:50 ratio."
        />

        <div>
          <SwapInput
            defaultValue={fromToken || "DTX"}
            selectValue={fromToken}
            isSelectDisabled={true}
            onSelectChange={(value: any) =>
              handleTokenChange("fromToken", value)
            }
            balance={`29 dUSD`}
          />
          <div className="flex justify-center items-center !-mt-2 !-mb-2 relative z-50">
            <Button
              type="button"
              variant={"outline"}
              size={"icon"}
              className="text-muted-foreground rounded-full p-1 w-6 h-6"
            >
              <PlusIcon className="w-3 h-3" />
            </Button>
          </div>
          <SwapInput
            defaultValue={toToken || "DTX"}
            selectValue={toToken}
            isSelectDisabled={true}
            onSelectChange={(value: any) => handleTokenChange("toToken", value)}
            balance={`29 dUSD`}
          />
        </div>
      </div>
      <Button
        type="submit"
        // loading={isLoading || swapDetailsLoading}
        size={"lg"}
        className="w-full mt-2"
      >
        Provide liquidity
      </Button>
    </div>
  );
};

export default ProvideLiquidity;
