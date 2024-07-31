import { format, subDays } from "date-fns";
import { getDateInterval, getHourInterval } from "./date";
import { ethers } from "ethers";

const calculateVolume = (
  data: any,
  interval: Date[],
  compareKey: string,
  formatStr: string
) => {
  return interval.map((intervalDate) => {
    const intervalKey = format(intervalDate, formatStr);
    const totalVolume = data.reduce((sum: number, item: any) => {
      const itemDate = new Date(parseInt(item.timestamp) * 1000);
      const itemKey = format(itemDate, formatStr);
      return itemKey === intervalKey
        ? sum + parseFloat(ethers.formatUnits(item[compareKey].toString()))
        : sum;
    }, 0);

    return {
      date: intervalDate,
      [compareKey]: totalVolume,
    };
  });
};

export const calculateTrend = (
  todayData: any,
  yesterdayData: any,
  compareKey: string
) => {
  const todayVolume = todayData.reduce(
    (acc: number, d: any) => acc + d[compareKey],
    0
  );
  const yesterdayVolume = yesterdayData.reduce(
    (acc: number, d: any) => acc + d[compareKey],
    0
  );

  const percentageChange =
    yesterdayVolume === 0
      ? 0
      : ((todayVolume - yesterdayVolume) / yesterdayVolume) * 100;
  return {
    isUp: percentageChange >= 0,
    percentage: Math.abs(percentageChange),
  };
};

export const processDataCurrent = (rawData: any, compareKey: string) => {
  try {
    const todayInterval = getHourInterval(new Date());
    const yesterdayInterval = getHourInterval(subDays(new Date(), 1));

    const todayData = calculateVolume(
      rawData,
      todayInterval,
      compareKey,
      "yyyy-MM-dd HH"
    );
    const yesterdayData = calculateVolume(
      rawData,
      yesterdayInterval,
      compareKey,
      "yyyy-MM-dd HH"
    );

    return calculateTrend(todayData, yesterdayData, compareKey);
  } catch (error) {
    console.log("err:", error);
    return { isUp: true, percentage: 0 };
  }
};

export const processData = (
  rawData: any,
  period: string,
  compareKey: string
) => {
  let interval;
  let formatStr;
  if (period === "1D") {
    interval = getHourInterval(new Date());
    formatStr = "yyyy-MM-dd HH";
  } else {
    const days = period === "1W" ? 7 : 30;
    interval = getDateInterval(days);
    formatStr = "yyyy-MM-dd";
  }

  return calculateVolume(rawData, interval, compareKey, formatStr);
};
