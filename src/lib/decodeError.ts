import { ethers } from "ethers";
import { ammErrors, defaultError, faucetErrors, stakingErrors } from "./errors";

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
export const decodeAmmError = async (error: any) => {
  try {
    const ammAbi = await import("@/lib/abis/AMM.json").then((data) => data.abi);

    const iface = new ethers.Interface(ammAbi);
    const errorData =
      error?.error?.data?.data ||
      error?.data?.data ||
      error?.data ||
      error?.transaction?.data ||
      error?.payload?.params[0]?.data;
    console.log("errorData:", errorData);
    if (errorData) {
      const decodedError = iface.parseError(errorData);
      console.log("decode error:", decodedError);
      if (!decodedError) return defaultError;

      const err = ammErrors[decodedError.name];
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
