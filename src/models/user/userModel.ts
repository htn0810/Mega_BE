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
});

export type User = z.infer<typeof UserModel>;
