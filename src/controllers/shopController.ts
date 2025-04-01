import shopService from "@services/shopService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class ShopController {
  getAllShops = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { page = 1, limit = 10 } = req.query;
      if (!page) {
        page = 1;
      }
      if (!limit) {
        limit = 10;
      }
      const shops = await shopService.getAllShops(
        parseInt(page as string),
        parseInt(limit as string)
      );
      res.status(StatusCodes.OK).json({
        message: "Shops fetched successfully!",
        data: shops,
      });
    } catch (error) {
      next(error);
    }
  };
}

const shopController = new ShopController();

export default shopController;
