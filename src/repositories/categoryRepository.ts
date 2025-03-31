import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "@/types/category/category.type";
import { GET_DB } from "@configs/database";

class CategoryRepository {
  async getAllCategoriesWithoutPagination() {
    try {
      const categories = await GET_DB().categories.findMany({
        where: { isDeleted: false },
      });
      return categories;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getAllCategories(page: number, limit: number) {
    const validatedPage = Math.max(1, Math.floor(page));
    const validatedLimit = Math.min(50, Math.max(1, Math.floor(limit)));
    const skip = (validatedPage - 1) * validatedLimit;

    try {
      const [categories, total] = await Promise.all([
        GET_DB().categories.findMany({
          skip,
          take: validatedLimit,
          where: {
            isDeleted: false,
          },
        }),
        GET_DB().categories.count({
          where: {
            isDeleted: false,
          },
        }),
      ]);

      return {
        categories: categories,
        pagination: {
          page: validatedPage,
          limit: validatedLimit,
          total,
          totalPages: Math.ceil(total / validatedLimit),
        },
      };
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getCategoryById(id: number) {
    try {
      const category = await GET_DB().categories.findUnique({
        where: { id, isDeleted: false },
      });
      return category;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getCategoryByName(name: string) {
    try {
      const category = await GET_DB().categories.findUnique({
        where: { name, isDeleted: false },
      });
      return category;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async createCategory(category: CreateCategoryDTO) {
    try {
      const newCategory = await GET_DB().categories.create({
        data: {
          name: category.name,
          imageUrl: category.imageUrl,
          parentId: category.parentId ?? null,
        },
      });
      return newCategory;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async updateCategory(id: number, category: UpdateCategoryDTO) {
    try {
      const updatedCategory = await GET_DB().categories.update({
        where: { id },
        data: {
          name: category.name,
          imageUrl: category.imageUrl,
          parentId: category.parentId ?? null,
        },
      });
      return updatedCategory;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async deleteCategory(id: number) {
    try {
      await GET_DB().categories.update({
        where: { id },
        data: {
          isDeleted: true,
        },
      });
    } catch (error) {
      throw new Error(error as string);
    }
  }
}

const categoryRepository = new CategoryRepository();

export default categoryRepository;
