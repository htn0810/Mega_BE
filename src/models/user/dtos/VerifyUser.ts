import { z } from "zod";

export const VerifyUserRequest = z.object({
  email: z.string({ required_error: "Email is required" }).email({
    message: "Invalid email address",
  }),
  token: z.string({ required_error: "Token is required" }),
});

export type VerifyUserDTO = z.infer<typeof VerifyUserRequest>;
