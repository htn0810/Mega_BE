import { CreateDiscountRequest } from "@/types/discount/discount.type";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { errorParser } from "@utils/errorParser";
import { BadRequestError } from "@exceptions/BadRequestError";

class DiscountValidation {
  createDiscount = (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = CreateDiscountRequest;
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessage = errorParser(error);
        throw new BadRequestError(errorMessage);
      }
      next(error);
    }
  };
}

const discountValidation = new DiscountValidation();

export default discountValidation;
