import { z } from "zod";

export const AddressSchema = z.object({
  id: z.number().optional(),
  userId: z
    .number({
      invalid_type_error: "User ID must be a number",
    })
    .optional(),
  name: z.string({
    invalid_type_error: "Name must be a string",
    required_error: "Name is required",
  }),
  phoneNumber: z
    .string({
      invalid_type_error: "Phone number must be a string with 10/11 digits",
      required_error: "Phone number is required",
    })
    .refine(
      (phoneNumber) => {
        // check regex phone number VietNam just include number
        return /(?:\+84|0084|0)[235789][0-9]{1,2}[0-9]{7}(?:[^\d]+|$)/g.test(
          phoneNumber
        );
      },
      {
        message: "Phone number is not valid",
      }
    ),
  provinceCode: z.string({
    invalid_type_error: "Province code must be a string",
    required_error: "Province code is required",
  }),
  districtCode: z.string({
    invalid_type_error: "District code must be a string",
    required_error: "District code is required",
  }),
  wardCode: z.string({
    invalid_type_error: "Ward code must be a string",
    required_error: "Ward code is required",
  }),
  street: z
    .string({
      invalid_type_error: "Street must be a string",
      required_error: "Street is required",
    })
    .max(255, {
      message: "Street must be less than 255 characters",
    }),
  isDefault: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Address = z.infer<typeof AddressSchema>;
