import { z } from "zod";

export const CreateProductRequest = z.object({
  name: z.string({
    required_error: "Name is required!",
    invalid_type_error: "Name must be a string!",
  }),
  description: z.string({
    required_error: "Description is required!",
    invalid_type_error: "Description must be a string!",
  }),
  price: z.number({
    required_error: "Price is required!",
    invalid_type_error: "Price must be a number!",
  }),
  stock: z.number({
    required_error: "Stock is required!",
    invalid_type_error: "Stock must be a number!",
  }),
  rating: z.number().optional(),
  slug: z.string({
    required_error: "Slug is required!",
    invalid_type_error: "Slug must be a string!",
  }),
  categoryId: z.number({
    required_error: "Category ID is required!",
    invalid_type_error: "Category ID must be a number!",
  }),
  shopId: z.number({
    required_error: "Shop ID is required!",
    invalid_type_error: "Shop ID must be a number!",
  }),
});

export type TCreateProductRequest = z.infer<typeof CreateProductRequest>;

export type CreateProductDTO = Omit<TCreateProductRequest, "imageUrls"> & {
  imageUrls: string;
};

export const UpdateProductRequest = CreateProductRequest.partial();
export type TUpdateProductRequest = z.infer<typeof UpdateProductRequest>;

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  imageUrls: string[];
  price: number;
  stock: number;
  rating: number | null;
  slug: string;
  shopId: number;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
}
