import CloudinaryProvider from "@providers/CloudinaryProvider";
import categoryRepository from "@repositories/categoryRepository";
import { BadRequestError } from "@exceptions/BadRequestError";
import _ from "lodash";
import { InternalServerError } from "@exceptions/InternalServerError";
import { CLOUDINARY_FOLDER_NAME } from "@utils/constants";
import {
  CreateCategoryDTO,
  CreateCategoryRequest,
  UpdateCategoryDTO,
  UpdateCategoryRequest,
} from "@/types/category/category.type";

class CategoryService {
  async getAllCategories() {
    try {
      const categories = await categoryRepository.getAllCategories();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  async createCategory(category: CreateCategoryRequest) {
    try {
      const existingCategory = await categoryRepository.getCategoryByName(
        category.name
      );

      if (existingCategory) {
        throw new BadRequestError(
          `Category with name: ${category.name} already exists!`
        );
      }

      if (category.parentId) {
        const parentCategory = await categoryRepository.getCategoryById(
          category.parentId
        );
        if (!parentCategory) {
          throw new BadRequestError("Parent category not found");
        }
      }

      if (!category.img) {
        throw new BadRequestError("Image is required!");
      }

      const imgUrl = await CloudinaryProvider.uploadImage(
        category.img.buffer,
        CLOUDINARY_FOLDER_NAME.CATEGORY
      );

      const cateCreate: CreateCategoryDTO = {
        imageUrl: imgUrl,
        ..._.omit(category, "img"),
      };

      const newCategory = await categoryRepository.createCategory(cateCreate);
      return newCategory;
    } catch (error) {
      console.log("🚀 ~ CategoryService ~ createCategory ~ error:", error);
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new InternalServerError(
        "Failed to create category. Please try again."
      );
    }
  }

  async updateCategory(id: number, category: UpdateCategoryRequest) {
    try {
      if (category.name) {
        const existingCategory = await categoryRepository.getCategoryByName(
          category.name
        );
        if (existingCategory) {
          throw new BadRequestError(
            `Category with name: ${category.name} already exists!`
          );
        }
      }

      const previousCategory = await categoryRepository.getCategoryById(id);
      if (!previousCategory) {
        throw new BadRequestError("Category not found");
      }

      if (category.parentId) {
        const parentCategory = await categoryRepository.getCategoryById(
          category.parentId
        );
        if (!parentCategory) {
          throw new BadRequestError("Parent category not found");
        }
      }

      const cateUpdate: UpdateCategoryDTO = {
        ..._.omit(category, "img"),
      };

      if (category.img) {
        await CloudinaryProvider.deleteImage(
          previousCategory.imageUrl,
          CLOUDINARY_FOLDER_NAME.CATEGORY
        );
        const imgUrl = await CloudinaryProvider.uploadImage(
          category.img.buffer,
          CLOUDINARY_FOLDER_NAME.CATEGORY
        );
        cateUpdate.imageUrl = imgUrl;
      }

      const updatedCategory = await categoryRepository.updateCategory(
        id,
        cateUpdate
      );
      return updatedCategory;
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(id: number) {
    try {
      const category = await categoryRepository.getCategoryById(id);
      if (!category) {
        throw new BadRequestError("Category not found");
      }

      await categoryRepository.deleteCategory(id);
    } catch (error) {
      throw error;
    }
  }
}

const categoryService = new CategoryService();
export default categoryService;
