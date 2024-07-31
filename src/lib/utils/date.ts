import {
  format,
  addDays,
  eachDayOfInterval,
  subDays,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
} from "date-fns";

export const formatXAxisDate = (date: string, period: any) => {
  if (period === "1D") {
    return format(date, "dd MMM yyyy hh:mm a");
  } else {
    return format(date, "dd MMM yyyy");
  }
};
export const getDateInterval = (days: any) => {
  const endDate = new Date();
  const startDate = subDays(endDate, days - 1);
  return eachDayOfInterval({ start: startDate, end: endDate });
};

export const getHourInterval = (date: any) => {
  return eachHourOfInterval({ start: startOfDay(date), end: endOfDay(date) });
};
