import { CreateShopRequest, UpdateShopRequest } from "@/types/shop/shop.type";
import { BadRequestError } from "@exceptions/BadRequestError";
import { errorParser } from "@utils/errorParser";
import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

class ShopValidation {
  createShop = (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = CreateShopRequest;
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

  updateShop = (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = UpdateShopRequest;
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

const shopValidation = new ShopValidation();

export default shopValidation;
