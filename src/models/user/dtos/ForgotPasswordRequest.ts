import { z } from "zod";

export const ForgotPasswordRequest = z.object({
  email: z.string({ required_error: "Email is required" }).email({
    message: "Invalid email address",
  }),
});

export type ForgotPasswordDTO = z.infer<typeof ForgotPasswordRequest>;
