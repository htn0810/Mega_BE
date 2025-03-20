import { z } from "zod";

const attributesSchema = z.object({
  name: z.string({
    required_error: "Attribute name is required!",
    invalid_type_error: "Attribute name must be a string!",
  }),
  values: z
    .array(
      z.string({
        required_error: "Attribute values are required!",
        invalid_type_error: "Attribute values must be an array of strings!",
      })
    )
    .refine(
      (values) => {
        const uniqueValues = new Set(values);
        return values.length === uniqueValues.size;
      },
      {
        message: "Values within an attribute must be unique",
      }
    ),
});

const attributeSchema = z.object({
  name: z.string({
    required_error: "Attribute name is required!",
    invalid_type_error: "Attribute name must be a string!",
  }),
  value: z.string({
    required_error: "Attribute value is required!",
    invalid_type_error: "Attribute value must be a string!",
  }),
});

export const CreateProductRequest = z.object({
  name: z.string({
    required_error: "Name is required!",
    invalid_type_error: "Name must be a string!",
  }),
  description: z.string({
    required_error: "Description is required!",
    invalid_type_error: "Description must be a string!",
  }),
  categoryId: z.number({
    required_error: "Category ID is required!",
    invalid_type_error: "Category ID must be a number!",
  }),
  shopId: z.number({
    required_error: "Shop ID is required!",
    invalid_type_error: "Shop ID must be a number!",
  }),
  attributes: z.array(attributesSchema).refine(
    (attributes) => {
      // Check for unique attribute names
      const names = attributes.map((attr) => attr.name);
      const uniqueNames = new Set(names);
      return names.length === uniqueNames.size;
    },
    {
      message: "Attribute names must be unique across all attributes",
    }
  ),
  variants: z.array(
    z.object({
      price: z.number({
        required_error: "Price is required!",
        invalid_type_error: "Price must be a number!",
      }),
      stock: z.number({
        required_error: "Stock is required!",
        invalid_type_error: "Stock must be a number!",
      }),
      attributes: z.array(attributeSchema),
    })
  ),
});

export type TCreateProductRequest = z.infer<typeof CreateProductRequest>;

export type CreateProductDTO = TCreateProductRequest & {
  imageUrls: string;
};
