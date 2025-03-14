import { z } from "zod";

export const CategoryModel = z.object({
  id: z.number(),
  name: z.string(),
  parentId: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Category = z.infer<typeof CategoryModel>;
