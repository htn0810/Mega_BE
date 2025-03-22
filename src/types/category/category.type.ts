import { z } from "zod";

export const CategoryModel = z.object({
  id: z.number(),
  name: z.string(),
  parentId: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Category = z.infer<typeof CategoryModel>;

// Request
export const CreateCategoryRequest = z.object({
  name: z.string({ required_error: "Category name is required" }).min(1, {
    message: "Category name cannot be empty",
  }),
  parentId: z
    .number({ invalid_type_error: "Parent id must be a number" })
    .optional(),
  img: z.custom<Express.Multer.File>(
    (val) => val instanceof Object && "originalname" in val,
    { message: "Please upload an image" }
  ),
});
export type CreateCategoryRequest = z.infer<typeof CreateCategoryRequest>;

export const CreateCategoryDTO = z.object({
  name: z.string({ required_error: "Category name is required" }).min(1, {
    message: "Category name cannot be empty",
  }),
  parentId: z
    .number({ invalid_type_error: "Parent id must be a number" })
    .optional(),
  imageUrl: z.string({ required_error: "Image URL is required" }),
});
export type CreateCategoryDTO = z.infer<typeof CreateCategoryDTO>;

export const UpdateCategoryRequest = z.object({
  name: z
    .string()
    .min(1, {
      message: "Category name cannot be empty",
    })
    .optional(),
  parentId: z
    .number({ invalid_type_error: "Parent id must be a number" })
    .optional(),
  img: z.custom<Express.Multer.File>().optional(),
});
export type UpdateCategoryRequest = z.infer<typeof UpdateCategoryRequest>;

export const UpdateCategoryDTO = z.object({
  name: z
    .string()
    .min(1, {
      message: "Category name cannot be empty",
    })
    .optional(),
  parentId: z
    .number({ invalid_type_error: "Parent id must be a number" })
    .optional(),
  imageUrl: z.string().optional(),
});
export type UpdateCategoryDTO = z.infer<typeof UpdateCategoryDTO>;
