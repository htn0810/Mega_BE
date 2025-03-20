import { BadRequestError } from "@exceptions/BadRequestError";
import { CreateProductRequest } from "@models/product/product.type";
import { errorParser } from "@utils/errorParser";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

class ProductValidation {
  createProduct = (req: Request, res: Response, next: NextFunction) => {
    try {
      const images = req.files;
      if (!images || images.length === 0) {
        throw new BadRequestError("Images are required");
      }
      const { productData } = req.body;
      const jsonProductData = JSON.parse(productData);
      if (!jsonProductData) {
        throw new BadRequestError("Product data is required!");
      }
      const schema = CreateProductRequest;
      schema.parse(jsonProductData);
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

const productValidation = new ProductValidation();

export default productValidation;
