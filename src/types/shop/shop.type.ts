import { ShopStatus } from "@prisma/client";
import { z } from "zod";

export const ShopModel = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string().optional(),
  avatarUrl: z.string().optional(),
  coverUrl: z.string().optional(),
  status: z.nativeEnum(ShopStatus),
});

export const CreateShopRequest = ShopModel.omit({ id: true, status: true });
export type TCreateShopRequest = z.infer<typeof CreateShopRequest>;
export const UpdateShopRequest = ShopModel.partial();
export type TUpdateShopRequest = z.infer<typeof UpdateShopRequest>;

export type Shop = z.infer<typeof ShopModel>;
