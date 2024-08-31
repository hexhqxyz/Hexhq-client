"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useQuery } from "@apollo/client";
import { GET_TVL_DATA } from "@/lib/services/graphql/queries";
import {
  format,
  addDays,
  eachDayOfInterval,
  subDays,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { ethers } from "ethers";
import { processData, processDataCurrent } from "@/lib/utils/compare";
import { formatXAxisDate } from "@/lib/utils/date";
import { Skeleton } from "@/components/ui/skeleton";

const chartData = [
  { date: "January", tvl: 186 },
  { date: "February", tvl: 305 },
  { date: "March", tvl: 237 },
  { date: "April", tvl: 73 },
  { date: "May", tvl: 209 },
  { date: "June", tvl: 214 },
];

const chartConfig = {
  tvl: {
    label: "TVL",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TVLChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("1D");
  const { loading, error, data } = useQuery(GET_TVL_DATA);
  const [chartData, setChartData] = useState([]);
  const [trend, setTrend] = useState({ isUp: true, percentage: 0 });

  useEffect(() => {
    if (data && data.tvls) {
      const trendData = processDataCurrent(data.tvls, "tvl");
      setTrend(trendData);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.tvls && selectedPeriod) {
      const formattedData = processData(data.tvls, selectedPeriod, "tvl");
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
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row w-full">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-4">
          <CardTitle className="text-xl">AstraDeFi Pool - TVL</CardTitle>
          <CardDescription>
            Showing total TVL &#40;Total value locked&#41; for the last 1 month
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
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={15}
              tickFormatter={(value) => ""}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value, payload) =>
                    formatXAxisDate(payload[0].payload.date, selectedPeriod)
                  }
                />
              }
            />
            <Area
              dataKey="tvl"
              type="natural"
              fill="var(--color-tvl)"
              fillOpacity={0.4}
              stroke="var(--color-tvl)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {trend.isUp ? (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-500" /> TVL up by{" "}
                  {trend.percentage.toFixed(2)}%
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-8 w-8 text-destructive" /> TVL down
                  by {trend.percentage.toFixed(2)}% today
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
              - {format(new Date(), "MMMM dd, yyyy")}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
