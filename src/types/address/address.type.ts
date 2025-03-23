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
  }),
  phoneNumber: z
    .string({
      invalid_type_error: "Phone number must be a string with 10/11 digits",
    })
    .refine(
      (phoneNumber) => {
        // check regex phone number just include number
        return /^[0-9]+$/.test(phoneNumber);
      },
      {
        message: "Phone number just include number",
      }
    ),
  provinceCode: z.string({
    invalid_type_error: "Province code must be a string",
  }),
  districtCode: z.string({
    invalid_type_error: "District code must be a string",
  }),
  wardCode: z.string({
    invalid_type_error: "Ward code must be a string",
  }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Address = z.infer<typeof AddressSchema>;
