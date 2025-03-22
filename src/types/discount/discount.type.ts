import { DiscountAppliesTo, DiscountType } from "@prisma/client";
import { z } from "zod";

export const CreateDiscountRequest = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1, { message: "Name must be at least 1 character long" }),
  shopId: z.number({
    required_error: "Shop ID is required",
    invalid_type_error: "Shop ID must be a number",
  }),
  description: z
    .string({ required_error: "Description is required" })
    .min(1, { message: "Description must be at least 1 character long" }),
  discountCode: z
    .string({ required_error: "Discount code is required" })
    .min(6, { message: "Discount code must be at least 6 character long" }),
  discountType: z.nativeEnum(DiscountType, {
    required_error: "Discount type is required",
    invalid_type_error:
      "Discount type must be a valid discount type (PERCENTAGE, FIXED)",
  }),
  discountValue: z.number({ required_error: "Discount value is required" }),
  startDate: z.coerce.date({ required_error: "Start date is required" }),
  endDate: z.coerce.date({ required_error: "End date is required" }),
  maxUsage: z.number({ required_error: "Max usage is required" }),
  minOrderAmount: z.number({ required_error: "Min order amount is required" }),
  discountMaxUsePerUser: z.number({
    required_error: "Discount max use per user is required",
  }),
  discountAppliesTo: z.nativeEnum(DiscountAppliesTo, {
    required_error: "Discount applies to is required",
    invalid_type_error:
      "Discount applies to must be a valid discount applies to (ALL, SPECIFIC_PRODUCTS)",
  }),
  discountAppliesToProducts: z.array(z.number()).optional(),
});

export type TCreateDiscountRequest = z.infer<typeof CreateDiscountRequest>;
