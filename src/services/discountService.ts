import { TCreateDiscountRequest } from "@/types/discount/discount.type";
import { ProductDiscount } from "@/types/product/product.type";
import { BadRequestError } from "@exceptions/BadRequestError";
import { DiscountAppliesTo, DiscountType } from "@prisma/client";
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

  async getDiscountAmount(
    discountCode: string,
    shopId: number,
    userId: number,
    products: ProductDiscount[]
  ) {
    try {
      // Check discount is exists
      const discount = await discountRepository.getDiscountByCode(discountCode);
      if (!discount) {
        throw new BadRequestError("Discount not found");
      }
      if (discount.shopId !== shopId) {
        throw new BadRequestError("Discount not found");
      }
      // Check discount is expired
      if (discount.endDate < new Date()) {
        throw new BadRequestError("Discount expired");
      }
      // Check discount reached max usage
      if (discount.discountUsage >= discount.maxUsage) {
        throw new BadRequestError("Discount reached max usage");
      }
      // Check user reached max usage
      const discountUserUsed = discount.usersUsedDiscount.find(
        (user) => user.userId === userId
      );
      if (
        discountUserUsed &&
        discount.discountMaxUsePerUser <= discountUserUsed.usageCount
      ) {
        throw new BadRequestError(
          "You have reached the maximum usage limit for this discount"
        );
      }

      let productsCanApplyDiscount: ProductDiscount[] = [];
      if (discount.discountAppliesTo === DiscountAppliesTo.SPECIFIC_PRODUCTS) {
        const productsCanApplyDiscountIds = discount.discountProducts.map(
          (product) => product.productId
        );
        productsCanApplyDiscount = products.filter((product) =>
          productsCanApplyDiscountIds.includes(product.id)
        );
      }
      if (discount.discountAppliesTo === DiscountAppliesTo.ALL) {
        productsCanApplyDiscount = products.filter(
          (product) => product.shopId === shopId
        );
      }

      if (productsCanApplyDiscount.length === 0) {
        throw new BadRequestError("No products can apply discount");
      }

      let note = "";
      if (productsCanApplyDiscount.length < products.length) {
        const nameProducts = productsCanApplyDiscount.map(
          (product) => product.name
        );
        note = `Discount just applied to ${
          productsCanApplyDiscount.length
        }  products: ${nameProducts.join(", ")}`;
      }

      const totalPrice = products.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );

      const totalPriceCanApplyDiscount = productsCanApplyDiscount.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );

      if (discount.minOrderAmount > totalPriceCanApplyDiscount) {
        throw new BadRequestError(
          "Order amount is not enough to apply discount"
        );
      }

      const discountAmount =
        discount.discountType === DiscountType.PERCENTAGE
          ? (totalPriceCanApplyDiscount * discount.discountValue) / 100
          : discount.discountValue;
      return {
        prevTotalPrice: totalPrice,
        discount: discountAmount,
        totalPrice: totalPrice - discountAmount,
        note,
      };
    } catch (error) {
      throw error;
    }
  }
}

const discountService = new DiscountService();

export default discountService;
