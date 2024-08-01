"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React, { useEffect, useState } from "react";
import LiquidityTable from "./LiquidityTable";

type Props = {};

const AmmTransactions = (props: Props) => {
  const [selectedType, setSelectedType] = useState("swap");

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full">
        <Card className="">
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row w-full">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-4">
              <CardTitle id="amm-transactions">Transactions</CardTitle>
            </div>
            <div className="flex px-2">
              <ToggleGroup
                type="single"
                defaultValue="swap"
                value={selectedType}
                onValueChange={(val) => {
                  setSelectedType((prev) => val || prev);
                }}
              >
                <ToggleGroupItem value="swap">Swaps</ToggleGroupItem>
                <ToggleGroupItem value="add">Add</ToggleGroupItem>
                <ToggleGroupItem value="remove">Remove</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </CardHeader>

          <CardContent className="p-0" >
            {selectedType === "swap" && <LiquidityTable type={"swap"} />}
            {selectedType === "add" && <LiquidityTable type={"add"} />}
            {selectedType === "remove" && <LiquidityTable type={"remove"} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AmmTransactions;
