import { z } from "zod";

export const UpdateUserRequest = z.object({
  name: z
    .string()
    .min(1, {
      message: "User name cannot be empty",
    })
    .optional(),
  currentPassword: z
    .string({ required_error: "Password is required" })
    .optional(),
  newPassword: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@$!%*?&)"
    )
    .optional(),
  avatar: z.custom<Express.Multer.File>().optional(),
});

export type UpdateUserRequest = z.infer<typeof UpdateUserRequest>;

export const UpdateUserDTO = z.object({
  name: z.string().optional(),
  password: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;
