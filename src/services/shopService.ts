import { BadRequestError } from "@exceptions/BadRequestError";
import { ForbiddenError } from "@exceptions/ForbiddenError";
import { ShopStatus } from "@prisma/client";
import shopRepository from "@repositories/shopRepository";
import userRepository from "@repositories/userRepository";

class ShopService {
  async getAllShops(page: number, limit: number, status: string) {
    try {
      const shops = await shopRepository.getAllShops(page, limit, status);
      return shops;
    } catch (error) {
      throw error;
    }
  }

  async getShopById(id: number) {
    try {
      const shop = await shopRepository.getShopById(id);
      if (!shop) {
        throw new BadRequestError("Shop not found");
      }
      return shop;
    } catch (error) {
      throw error;
    }
  }

  async getProductsByShopId(id: number) {
    try {
      const existingShop = await shopRepository.getShopById(id);
      if (!existingShop) {
        throw new BadRequestError("Shop not found");
      }

      const products = await shopRepository.getProductsByShopId(id);
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProductsByShopIdForAdmin(
    id: number,
    page: number,
    limit: number,
    email: string
  ) {
    try {
      const existingShop = await shopRepository.getShopById(id);
      if (!existingShop) {
        throw new BadRequestError("Shop not found");
      }
      const userShop = await userRepository.getShopByUserEmail(email);
      if (!userShop || userShop.id !== existingShop.id) {
        throw new ForbiddenError("Not have permission to access this shop");
      }
      const products = await shopRepository.getProductsByShopIdForAdmin(
        id,
        page,
        limit
      );
      return products;
    } catch (error) {
      throw error;
    }
  }

  async disableShop(id: number) {
    try {
      const existingShop = await shopRepository.getShopById(id);
      if (!existingShop) {
        throw new BadRequestError("Shop not found");
      }
      const shop = await shopRepository.updateShop(id, {
        status: ShopStatus.DISABLED,
      });
      return shop;
    } catch (error) {
      throw error;
    }
  }

  async enableShop(id: number) {
    try {
      const existingShop = await shopRepository.getShopById(id);
      if (!existingShop) {
        throw new BadRequestError("Shop not found");
      }
      const shop = await shopRepository.updateShop(id, {
        status: ShopStatus.ACTIVE,
      });
      return shop;
    } catch (error) {
      throw error;
    }
  }

  async approveShop(id: number) {
    try {
      const existingShop = await shopRepository.getShopById(id);
      if (!existingShop) {
        throw new BadRequestError("Shop not found");
      }
      const shop = await shopRepository.updateShop(id, {
        status: ShopStatus.ACTIVE,
      });
      return shop;
    } catch (error) {
      throw error;
    }
  }

  async rejectShop(id: number) {
    try {
      const existingShop = await shopRepository.getShopById(id);
      if (!existingShop) {
        throw new BadRequestError("Shop not found");
      }
      const shop = await shopRepository.updateShop(id, {
        status: ShopStatus.REJECTED,
      });
      return shop;
    } catch (error) {
      throw error;
    }
  }
}

const shopService = new ShopService();

export default shopService;
