import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "@/types/category/category.type";
import { GET_DB } from "@configs/database";

class CategoryRepository {
  async getAllCategories() {
    try {
      const categories = await GET_DB().categories.findMany();
      return categories;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getCategoryById(id: number) {
    try {
      const category = await GET_DB().categories.findUnique({
        where: { id },
      });
      return category;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getCategoryByName(name: string) {
    try {
      const category = await GET_DB().categories.findUnique({
        where: { name },
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
      await GET_DB().categories.delete({ where: { id } });
    } catch (error) {
      throw new Error(error as string);
    }
  }
}

const categoryRepository = new CategoryRepository();

export default categoryRepository;
