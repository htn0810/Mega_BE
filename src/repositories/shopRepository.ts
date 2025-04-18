import { TCreateShopRequest } from "@/types/shop/shop.type";
import { GET_DB } from "@configs/database";
import { Shops, ShopStatus } from "@prisma/client";

class ShopRepository {
  async getAllShops(page: number, limit: number, status: string) {
    try {
      let condition = {};
      if (status !== "all") {
        condition = { status: status as ShopStatus };
      }
      const validatedPage = Math.max(1, Math.floor(page));
      const validatedLimit = Math.min(50, Math.max(1, Math.floor(limit)));
      const skip = (validatedPage - 1) * validatedLimit;

      const [shops, total] = await Promise.all([
        GET_DB().shops.findMany({
          where: condition,
          skip,
          take: validatedLimit,
        }),
        GET_DB().shops.count({
          where: condition,
        }),
      ]);
      return {
        shops: shops,
        pagination: {
          page: validatedPage,
          limit: validatedLimit,
          total,
          totalPages: Math.ceil(total / validatedLimit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getShopById(id: number) {
    try {
      const shop = await GET_DB().shops.findUnique({
        where: { id },
      });
      return shop;
    } catch (error) {
      throw error;
    }
  }

  async getShopByName(name: string) {
    try {
      const shop = await GET_DB().shops.findUnique({
        where: { name },
      });
      return shop;
    } catch (error) {
      throw error;
    }
  }

  async getProductsByShopId(id: number, page: number, limit: number) {
    try {
      const validatedPage = Math.max(1, Math.floor(page));
      const validatedLimit = Math.min(50, Math.max(1, Math.floor(limit)));
      const skip = (validatedPage - 1) * validatedLimit;
      const [products, total] = await Promise.all([
        GET_DB().products.findMany({
          where: {
            shopId: id,
            isDeleted: false,
            isActive: true,
          },
          skip,
          take: validatedLimit,
        }),
        GET_DB().products.count({
          where: {
            shopId: id,
            isDeleted: false,
            isActive: true,
          },
        }),
      ]);
      return {
        products: products,
        pagination: {
          page: validatedPage,
          limit: validatedLimit,
          total: total,
          totalPages: Math.ceil(total / validatedLimit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getProductsByShopIdForAdmin(id: number, page: number, limit: number) {
    try {
      const validatedPage = Math.max(1, Math.floor(page));
      const validatedLimit = Math.min(50, Math.max(1, Math.floor(limit)));
      const skip = (validatedPage - 1) * validatedLimit;
      const [products, total] = await Promise.all([
        GET_DB().products.findMany({
          where: {
            shopId: id,
            isDeleted: false,
          },
          skip,
          take: validatedLimit,
        }),
        GET_DB().products.count({
          where: {
            shopId: id,
            isDeleted: false,
          },
        }),
      ]);
      return {
        products: products,
        pagination: {
          page: validatedPage,
          limit: validatedLimit,
          total: total,
          totalPages: Math.ceil(total / validatedLimit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async createShop(data: TCreateShopRequest, userId: number) {
    try {
      const shop = await GET_DB().shops.create({
        data: {
          ...data,
          status: ShopStatus.PENDING,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      return shop;
    } catch (error) {
      throw error;
    }
  }

  async updateShop(id: number, data: Partial<Shops>) {
    try {
      const shop = await GET_DB().shops.update({
        where: { id },
        data,
      });
      return shop;
    } catch (error) {
      throw error;
    }
  }

  async disableShop(id: number) {
    try {
      const shop = await GET_DB().shops.update({
        where: { id },
        data: { status: ShopStatus.DISABLED },
      });
      return shop;
    } catch (error) {
      throw error;
    }
  }

  async enableShop(id: number) {
    try {
      const shop = await GET_DB().shops.update({
        where: { id },
        data: { status: ShopStatus.ACTIVE },
      });
      return shop;
    } catch (error) {
      throw error;
    }
  }

  async approveShop(id: number) {
    try {
      const shop = await GET_DB().shops.update({
        where: { id },
        data: { status: ShopStatus.ACTIVE },
      });
      return shop;
    } catch (error) {
      throw error;
    }
  }
}

const shopRepository = new ShopRepository();

export default shopRepository;
