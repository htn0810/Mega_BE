import { ShopStatus, Shops } from "@prisma/client";
import { z } from "zod";

export const ShopModel = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  avatarUrl: z.string().optional(),
  coverUrl: z.string().optional(),
  status: z.nativeEnum(ShopStatus),
});

export type Shop = z.infer<typeof ShopModel>;
