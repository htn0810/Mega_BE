import shopRepository from "@repositories/shopRepository";

class ShopService {
  async getAllShops(page: number, limit: number) {
    try {
      const shops = await shopRepository.getAllShops(page, limit);
      return shops;
    } catch (error) {
      throw error;
    }
  }
}

const shopService = new ShopService();

export default shopService;
