"use client";

import TransactionTable from "@/components/AMM/transactions/TransactionTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React, { useEffect, useState } from "react";

type Props = {};

const Page = (props: Props) => {
  const [selectedType, setSelectedType] = useState("swap");

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full p-6">
        <Card className="">
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row w-full">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-4">
              <CardTitle>Transactions</CardTitle>
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

          <CardContent className="p-0">
            {selectedType === "swap" && <TransactionTable type={"swap"} />}
            {selectedType === "add" && <TransactionTable type={"add"} />}
            {selectedType === "remove" && <TransactionTable type={"remove"} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
