import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import numeral from "numeral";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenString = (
  val: string,
  start: number = 6,
  end: number = -4
) => {
  if (!val) return "";
  return `${val.slice(0, start)}...${val.slice(end)}`;
};

export function formatNumber(
  value: string | null | any,
  humanify: boolean = true,
  decimals = 2,
) {
  if (!value) return "0.0";
  const floatValue = parseFloat(value);

  if (floatValue >= 1000 && humanify) {
    return numeral(floatValue).format("0.[0]a");
  }
  if (floatValue === 0) {
    return "0.0";
  } else if (floatValue < 1) {
    return floatValue.toFixed(6).replace(/\.?0+$/, "");
  } else if (floatValue % 1 === 0) {
    return floatValue.toFixed(1);
  } else {
    return floatValue.toFixed(decimals).replace(/\.?0+$/, "");
  }
}

export const formatNumberSmall = (number: string, decimals = 2) => {
  if (!number) return "0";
  const factor = Math.pow(10, decimals);
  const formattedNumber = Math.floor(parseFloat(number) * factor) / factor;
  return formattedNumber.toFixed(decimals);};

export function roundToNearestHalf(value: string) {
  const floatValue = parseFloat(value);
  const roundedValue = Math.ceil(floatValue * 2) / 2;
  return roundedValue.toFixed(1);
}
