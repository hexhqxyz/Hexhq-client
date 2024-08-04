"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@apollo/client";
import { GET_VOLUME_DATA } from "@/lib/services/graphql/queries";
import { ethers } from "ethers";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { format, subDays } from "date-fns";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  calculateTrend,
  processData,
  processDataCurrent,
} from "@/lib/utils/compare";
import {
  formatXAxisDate,
  getDateInterval,
  getHourInterval,
} from "@/lib/utils/date";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  views: {
    label: "Volume",
  },
  volume: {
    label: "Volume",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function VolumeChart() {
  const { loading, error, data } = useQuery(GET_VOLUME_DATA);
  const [selectedPeriod, setSelectedPeriod] = useState("1D");
  const [chartData, setChartData] = React.useState([]);
  const [trend, setTrend] = useState({ isUp: true, percentage: 0 });
  useState<keyof typeof chartConfig>("volume");

  useEffect(() => {
    if (data && data.volumes) {
      const trendData = processDataCurrent(data.volumes, "volume");
      setTrend(trendData);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.volumes && selectedPeriod) {
      const formattedData = processData(data.volumes, selectedPeriod, "volume");
      setChartData(formattedData as any);
    }
  }, [data, selectedPeriod]);
  if (loading)
    return (
      <div>
        <Skeleton className="h-96 w-full" />
      </div>
    );

  if (error)
    return <div>Something went wrong. Please try to reload the page</div>;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row w-full">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-4">
          <CardTitle className="text-xl">OmniDeFi Pool - Volume</CardTitle>
          <CardDescription>
            Showing total volume for the last 1 month
          </CardDescription>
        </div>
        <div className="flex px-2">
          <ToggleGroup
            type="single"
            defaultValue="1D"
            onValueChange={(val) => {
              console.log("val:", val);
              setSelectedPeriod(val);
            }}
          >
            <ToggleGroupItem value="1D">1D</ToggleGroupItem>
            <ToggleGroupItem value="1W">1W</ToggleGroupItem>
            <ToggleGroupItem value="1M">1M</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[260px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 10,
              right: 10,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={() => ""}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="volume"
                  labelFormatter={(value, payload) =>
                    formatXAxisDate(payload[0].payload.date, selectedPeriod)
                  }
                />
              }
            />
            <Bar dataKey={"volume"} fill={`var(--color-${"volume"})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {trend.isUp ? (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-500" /> Volume up by {" "}
                   {trend.percentage.toFixed(2)}%
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-8 w-8 text-destructive" /> Volume
                  down by {trend.percentage.toFixed(2)}% today
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {format(
                subDays(
                  new Date(),
                  selectedPeriod === "1D" ? 1 : selectedPeriod === "1W" ? 7 : 30
                ),
                "MMMM dd, yyyy"
              )}
               {format(new Date(), "MMMM dd, yyyy")}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
