import { z } from "zod";

export const ApproveTokenSchema = z.object({
  amount: z.string().min(1, "Amount cannot be empty"),
});

export const swapSchema = z.object({
  fromAmount: z.string().min(1, "Amount cannot be empty").regex(/^\d+(\.\d{1,18})?$/, "Invalid amount format"),
  toAmount: z.string().min(1, "Amount cannot be empty").regex(/^\d+(\.\d{1,18})?$/, "Invalid amount format"),
  // fromToken: z.string(),
  // toToken: z.string(),
});