import { BadRequestError } from "@exceptions/BadRequestError";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@models/category/dtos/CreateCategory";
import { errorParser } from "@utils/errorParser";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class CategoryValidation {
  createCategory = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.file) {
        req.body.img = req.file;
      }
      if (req.body.parentId) {
        req.body.parentId = parseInt(req.body.parentId);
      }
      const schema = CreateCategoryRequest;
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessage = errorParser(error);
        throw new BadRequestError(errorMessage);
      }
    }
  };

  updateCategory = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.file) {
        req.body.img = req.file;
      }
      if (req.body.parentId) {
        req.body.parentId = parseInt(req.body.parentId);
      }
      const schema = UpdateCategoryRequest;
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessage = errorParser(error);
        throw new BadRequestError(errorMessage);
      }
    }
  };
}

export default new CategoryValidation();
