import { z } from "zod";


export const ApproveTokenSchema = z.object({
    amount: z.string().min(1, "Amount cannot be empty"),
  });
  