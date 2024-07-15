import { ethers } from "ethers";
import faucetAbi from "@/lib/abis/Faucet.json";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { defaultError, faucetErrors } from "./errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const decodeFaucetError = (error: any) => {
  try {
    const iface = new ethers.Interface(faucetAbi.abi);
    const errorData =
      error?.error?.data?.data || error?.data?.data || error?.data;
    if (errorData) {
      const decodedError = iface.parseError(errorData);
      if (!decodedError) return defaultError;

      if (faucetErrors[decodedError.name]) {
        const { title, description } = faucetErrors[decodedError.name];
        return { title, description: description(decodedError.args) };
      }
    }
  } catch (err) {
    return defaultError;
  }
  return defaultError;
};
