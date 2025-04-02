import { BadRequestError } from "@exceptions/BadRequestError";
import { ShopStatus } from "@prisma/client";
import shopRepository from "@repositories/shopRepository";

class ShopService {
  async getAllShops(page: number, limit: number, status: string) {
    try {
      const shops = await shopRepository.getAllShops(page, limit, status);
      return shops;
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
