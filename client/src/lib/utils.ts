import { ethers } from "ethers";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { defaultError, faucetErrors, stakingErrors } from "./errors";

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

export const decodeFaucetError = async (error: any) => {
  try {
    const faucetAbi = await import("@/lib/abis/Faucet.json").then(
      (data) => data.abi
    );

    const iface = new ethers.Interface(faucetAbi);
    const errorData =
      error?.error?.data?.data ||
      error?.data?.data ||
      error?.data ||
      error?.transaction?.data ||
      error?.payload?.params[0]?.data;
    console.log(
      "errorData:",
      errorData,
      "error?.payload?.params[0]?.data",
      error?.payload?.params[0]?.data
    );
    if (errorData) {
      const decodedError = iface.parseError(errorData);
      console.log("decode error:", decodedError);
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
export const decodeStakingError = async (error: any) => {
  try {
    const stakingAbi = await import("@/lib/abis/Staking.json").then(
      (data) => data.abi
    );

    const iface = new ethers.Interface(stakingAbi);
    const errorData =
      error?.error?.data?.data ||
      error?.data?.data ||
      error?.data ||
      error?.transaction?.data ||
      error?.payload?.params[0]?.data;
    console.log(
      "errorData:",
      errorData,
      "error?.payload?.params[0]?.data",
      error?.payload?.params[0]?.data
    );
    if (errorData) {
      const decodedError = iface.parseError(errorData);
      console.log("decode error:", decodedError);
      if (!decodedError) return defaultError;

      const err = stakingErrors[decodedError.name];
      if (err) {
        const { title, description } = err;
        return { title, description };
      }
    }
  } catch (err) {
    return defaultError;
  }
  return defaultError;
};
