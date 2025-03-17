import { RoleModel } from "@models/role/roleModel";
import { z } from "zod";

export const UserRolesModel = z.object({
  userId: z.number(),
  roleId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  role: RoleModel,
});

export type UserRoles = z.infer<typeof UserRolesModel>;
