import { TCreateDiscountRequest } from "@/types/discount/discount.type";
import { BadRequestError } from "@exceptions/BadRequestError";
import discountRepository from "@repositories/discountRepository";
import productRepository from "@repositories/productRepository";

class DiscountService {
  async getAllDiscounts(shopId: number, limit: number, page: number) {
    try {
      const discounts = await discountRepository.getAllDiscounts(
        shopId,
        limit,
        page
      );
      return discounts;
    } catch (error) {
      throw error;
    }
  }

  async createDiscount(discount: TCreateDiscountRequest) {
    try {
      // Check discount code is already exists
      const existingDiscount = await discountRepository.getDiscountByCode(
        discount.discountCode
      );
      if (existingDiscount) {
        throw new BadRequestError("Discount code already exists");
      }

      // Check discount start date is in the future
      if (discount.startDate < new Date()) {
        throw new BadRequestError("Start date must be in the future");
      }
      discount.startDate = new Date(discount.startDate);

      // Check discount end date is in the future
      if (discount.endDate < new Date()) {
        throw new BadRequestError("End date must be in the future");
      }
      discount.endDate = new Date(discount.endDate);

      const newDiscount = await discountRepository.createDiscount(discount);
      return newDiscount;
    } catch (error) {
      throw error;
    }
  }

  async getAllDiscountsOfProduct(shopId: number, productId: number) {
    try {
      // Check product is exists
      const product = await productRepository.getProductById(productId);
      if (!product) {
        throw new BadRequestError("Product not found");
      }
      const discountsByProductId =
        await discountRepository.getAllDiscountsByProductId(productId);
      const discountsByShopId =
        await discountRepository.getAllDiscountsByShopId(shopId);
      const discounts = [...discountsByProductId, ...discountsByShopId];
      return discounts;
    } catch (error) {
      throw error;
    }
  }
}

const discountService = new DiscountService();

export default discountService;
