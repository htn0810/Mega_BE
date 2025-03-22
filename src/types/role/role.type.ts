import { z } from "zod";

export const RoleModel = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Role = z.infer<typeof RoleModel>;
