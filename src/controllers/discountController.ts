import discountService from "@services/discountService";
import { NextFunction, Request, Response } from "express";

class DiscountController {
  async getAllDiscounts(req: Request, res: Response, next: NextFunction) {
    try {
      const { shopId } = req.body;
      const { limit, page } = req.query;
      const discounts = await discountService.getAllDiscounts(
        shopId,
        parseInt(limit as string),
        parseInt(page as string)
      );
      res.status(200).json({
        message: "Discounts fetched successfully",
        data: discounts,
      });
    } catch (error) {
      next(error);
    }
  }

  async createDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const discount = await discountService.createDiscount(req.body);
      res.status(201).json({
        message: "Discount created successfully",
        data: discount,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllDiscountsOfProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { shopId, productId } = req.params;
      const discounts = await discountService.getAllDiscountsOfProduct(
        parseInt(shopId),
        parseInt(productId)
      );
      res.status(200).json({
        message: "Discounts fetched successfully",
        data: discounts,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDiscountAmount(req: Request, res: Response, next: NextFunction) {
    try {
      const { products, discountCode, shopId, userId } = req.body;
      const discountAmount = await discountService.getDiscountAmount(
        discountCode,
        shopId,
        userId,
        products
      );
      res.status(200).json({
        message: "Discount amount fetched successfully",
        data: discountAmount,
      });
    } catch (error) {
      next(error);
    }
  }
}

const discountController = new DiscountController();

export default discountController;
