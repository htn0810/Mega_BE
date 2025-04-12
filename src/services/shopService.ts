import { BadRequestError } from "@exceptions/BadRequestError";
import { ForbiddenError } from "@exceptions/ForbiddenError";
import { ShopStatus } from "@prisma/client";
import { Shop, TCreateShopRequest } from "@/types/shop/shop.type";
import cloudinaryProvider from "@providers/CloudinaryProvider";
import shopRepository from "@repositories/shopRepository";
import userRepository from "@repositories/userRepository";
import { CLOUDINARY_FOLDER_NAME } from "@utils/constants";

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

  async getProductsByShopId(id: number, page: number, limit: number) {
    try {
      const existingShop = await shopRepository.getShopById(id);
      if (!existingShop) {
        throw new BadRequestError("Shop not found");
      }

      const products = await shopRepository.getProductsByShopId(
        id,
        page,
        limit
      );
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProductsByShopIdForAdmin(
    id: number,
    page: number,
    limit: number,
    userId: number
  ) {
    try {
      const existingShop = await shopRepository.getShopById(id);
      if (!existingShop) {
        throw new BadRequestError("Shop not found");
      }
      const userShop = await userRepository.getShopByUserId(userId);
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

  async updateCoverImage(id: number, coverImage: Express.Multer.File) {
    let coverUrl = "";
    try {
      const existingShop = await shopRepository.getShopById(id);
      if (!existingShop) {
        throw new BadRequestError("Shop not found");
      }

      if (existingShop.coverUrl) {
        await cloudinaryProvider.deleteImage(
          existingShop.coverUrl,
          CLOUDINARY_FOLDER_NAME.SHOP
        );
      }

      coverUrl = await cloudinaryProvider.uploadImage(
        coverImage.buffer,
        CLOUDINARY_FOLDER_NAME.SHOP
      );
      await shopRepository.updateShop(id, {
        coverUrl: coverUrl,
      });
      return coverUrl;
    } catch (error) {
      await cloudinaryProvider.deleteImage(
        coverUrl,
        CLOUDINARY_FOLDER_NAME.SHOP
      );
      throw error;
    }
  }

  async updateProfileImage(id: number, profileImage: Express.Multer.File) {
    let profileUrl = "";
    try {
      const existingShop = await shopRepository.getShopById(id);
      if (!existingShop) {
        throw new BadRequestError("Shop not found");
      }

      if (existingShop.avatarUrl) {
        await cloudinaryProvider.deleteImage(
          existingShop.avatarUrl,
          CLOUDINARY_FOLDER_NAME.SHOP
        );
      }

      profileUrl = await cloudinaryProvider.uploadImage(
        profileImage.buffer,
        CLOUDINARY_FOLDER_NAME.SHOP
      );
      await shopRepository.updateShop(id, {
        avatarUrl: profileUrl,
      });
      return profileUrl;
    } catch (error) {
      await cloudinaryProvider.deleteImage(
        profileUrl,
        CLOUDINARY_FOLDER_NAME.SHOP
      );
      throw error;
    }
  }

  async createShop(shop: TCreateShopRequest, userId: number) {
    try {
      const user = await userRepository.getUserById(userId);
      if (!user) {
        throw new BadRequestError("User not found");
      }
      const existingShop = await shopRepository.getShopByName(shop.name);
      if (existingShop) {
        throw new BadRequestError("Shop already exists");
      }
      const newShop = await shopRepository.createShop(shop, user.id);
      return newShop;
    } catch (error) {
      throw error;
    }
  }

  async updateShop(id: number, shop: Shop) {
    try {
      const existingShop = await shopRepository.getShopById(id);
      if (!existingShop) {
        throw new BadRequestError("Shop not found");
      }
      const updatedShop = await shopRepository.updateShop(id, shop);
      return updatedShop;
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
