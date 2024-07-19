import { ethers } from "ethers";

export const defaultError = {
  title: "Error",
  description: "Something went wrong",
};

export const faucetErrors: Record<
  string,
  { title: string; description: (args: any) => string }
> = {
  ClaimTooSoon: {
    title: "Claim Too Soon",
    description: (args) =>
      `Please wait ${args[0].toString()} seconds before claiming again.`,
  },
  FaucetInsufficientFunds: {
    title: "Insufficient Funds",
    description: (args) =>
      `Faucet has insufficient funds. Requested: ${ethers.formatUnits(
        args[0],
        18
      )}, Available: ${ethers.formatUnits(args[1], 18)}`,
  },
  FaucetAlreadyClaimed: {
    title: "Already Claimed",
    description: () => `You have already claimed the faucet.`,
  },
};

export const stakingErrors: Record<
  string,
  { title: string; description?: string }
> = {
  AmountMustBeGreaterThanZero: {
    title: "Amount Must Be Greater Than Zero",
  },
  AmountNotEnough: {
    title: "Insufficient Funds",
  },
  TransferFailed: {
    title: "Transfer failed",
    description:
      "Something went wrong. Please check transaction details for more",
  },
};
