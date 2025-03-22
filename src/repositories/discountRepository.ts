import { TCreateDiscountRequest } from "@/types/discount/discount.type";
import { GET_DB } from "@configs/database";
import { DiscountAppliesTo } from "@prisma/client";

class DiscountRepository {
  async getAllDiscounts(shopId: number, limit: number = 10, page: number = 1) {
    const validatedPage = Math.max(1, Math.floor(page));
    const validatedLimit = Math.min(50, Math.max(1, Math.floor(limit)));
    const skip = (validatedPage - 1) * validatedLimit;

    try {
      const [discounts, total] = await Promise.all([
        GET_DB().discounts.findMany({
          where: {
            isDeleted: false,
            shopId,
          },
          include: {
            shop: {
              select: {
                name: true,
                id: true,
              },
            },
          },
          skip,
          take: validatedLimit,
        }),
        GET_DB().discounts.count({
          where: {
            isDeleted: false,
            shopId,
          },
        }),
      ]);
      return {
        discounts,
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

  async getDiscountByCode(discountCode: string) {
    try {
      const discount = await GET_DB().discounts.findUnique({
        where: { discountCode },
      });
      return discount;
    } catch (error) {
      throw error;
    }
  }

  async createDiscount(discount: TCreateDiscountRequest) {
    try {
      const createData = this.prepareDiscountData(discount);

      const newDiscount = await GET_DB().discounts.create({
        data: createData,
      });

      return newDiscount;
    } catch (error) {
      console.log("🚀 ~ DiscountRepository ~ createDiscount ~ error:", error);
      throw error;
    }
  }

  private prepareDiscountData(discount: TCreateDiscountRequest) {
    const { discountAppliesToProducts, ...discountData } = discount;

    // Check if we need to connect specific products
    const shouldConnectProducts =
      discount.discountAppliesTo === DiscountAppliesTo.SPECIFIC_PRODUCTS &&
      discountAppliesToProducts &&
      discountAppliesToProducts.length > 0;

    // Create the appropriate data structure
    if (shouldConnectProducts) {
      return {
        ...discountData,
        discountProducts: {
          create: discountAppliesToProducts.map((productId) => ({
            productId,
          })),
        },
      };
    }

    return discountData;
  }

  async getAllDiscountsByProductId(productId: number) {
    try {
      const discounts = await GET_DB().discounts.findMany({
        where: {
          isDeleted: false,
          discountProducts: {
            some: {
              productId,
            },
          },
        },
      });
      return discounts;
    } catch (error) {
      throw error;
    }
  }

  async getAllDiscountsByShopId(shopId: number) {
    try {
      const discounts = await GET_DB().discounts.findMany({
        where: {
          isDeleted: false,
          discountAppliesTo: DiscountAppliesTo.ALL,
          shopId,
        },
      });
      return discounts;
    } catch (error) {
      throw error;
    }
  }
}

const discountRepository = new DiscountRepository();

export default discountRepository;
