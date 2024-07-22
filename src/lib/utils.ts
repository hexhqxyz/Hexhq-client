import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

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

export function formatNumber(value:string|null | any) {
  if(!value) return "0.0";
  const floatValue = parseFloat(value);
  if (floatValue % 1 === 0) {
    return floatValue.toFixed(1);
  } else {
    return floatValue.toFixed(2).replace(/\.?0+$/, '');
  }
}
