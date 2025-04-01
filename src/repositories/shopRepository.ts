import { GET_DB } from "@configs/database";

class ShopRepository {
  async getAllShops(page: number, limit: number) {
    const validatedPage = Math.max(1, Math.floor(page));
    const validatedLimit = Math.min(50, Math.max(1, Math.floor(limit)));
    const skip = (validatedPage - 1) * validatedLimit;

    const [shops, total] = await Promise.all([
      GET_DB().shops.findMany({
        skip,
        take: validatedLimit,
      }),
      GET_DB().shops.count(),
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
  }
}

const shopRepository = new ShopRepository();

export default shopRepository;
