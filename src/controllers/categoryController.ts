import { BadRequestError } from "@exceptions/BadRequestError";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@models/category/dtos/CreateCategory";
import categoryService from "@services/categoryService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class CategoryController {
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(StatusCodes.OK).json({
        message: "Get all categories successfully!",
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.file) {
        req.body.img = req.file;
      }

      const category: CreateCategoryRequest = req.body;

      const newCategory = await categoryService.createCategory(category);
      res.status(StatusCodes.CREATED).json({
        message: "Create category successfully!",
        data: newCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError("Category id is required");
      }

      if (req.file) {
        req.body.img = req.file;
      }

      const categoryUpdate: UpdateCategoryRequest = req.body;
      const updatedCategory = await categoryService.updateCategory(
        parseInt(id),
        categoryUpdate
      );
      res.status(StatusCodes.OK).json({
        message: "Update category successfully!",
        data: updatedCategory,
      });
    } catch (error) {
      next(error);
    }
  }
}

const categoryController = new CategoryController();

export default categoryController;
