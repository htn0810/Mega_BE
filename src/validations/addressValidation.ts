import { AddressSchema } from "@/types/address/address.type";
import { BadRequestError } from "@exceptions/BadRequestError";
import { errorParser } from "@utils/errorParser";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

class AddressValidation {
  createUpdateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = AddressSchema;
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = errorParser(error);
        throw new BadRequestError(errorMessage);
      }
      next(error);
    }
  }
}

const addressValidation = new AddressValidation();
export default addressValidation;
