import { RoleModel } from "@/types/role/role.type";
import { z } from "zod";

export const UserModel = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  avatarUrl: z.string().nullable().optional(),
  isVerified: z.boolean(),
  isDeleted: z.boolean(),
  verifyToken: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  roles: z.array(RoleModel).optional(),
});

export type User = z.infer<typeof UserModel>;

export type UserInfoJwt = {
  email: string;
  name: string;
};

// Request
export const RegisterLoginUserRequest = z.object({
  email: z.string({ required_error: "Email is required" }).email({
    message: "Invalid email address",
  }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@$!%*?&)"
    ),
});
export type RegisterLoginUserDTO = z.infer<typeof RegisterLoginUserRequest>;

export const ForgotPasswordRequest = z.object({
  email: z.string({ required_error: "Email is required" }).email({
    message: "Invalid email address",
  }),
});
export type ForgotPasswordDTO = z.infer<typeof ForgotPasswordRequest>;

export const UpdateUserRequest = z.object({
  name: z
    .string()
    .min(1, {
      message: "User name cannot be empty",
    })
    .optional(),

  avatar: z.custom<Express.Multer.File>().optional(),
});

export type UpdateUserRequest = z.infer<typeof UpdateUserRequest>;

export const ChangePasswordRequest = z.object({
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
});
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequest>;

export const UpdateUserDTO = z.object({
  name: z.string().optional(),
  password: z.string().optional(),
  avatarUrl: z.string().optional(),
});
export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;

export const VerifyUserRequest = z.object({
  email: z.string({ required_error: "Email is required" }).email({
    message: "Invalid email address",
  }),
  token: z.string({ required_error: "Token is required" }),
});
export type VerifyUserDTO = z.infer<typeof VerifyUserRequest>;
// Response
