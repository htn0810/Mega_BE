import { UserInfoJwt } from "@/types/user/user.type";
import shopService from "@services/shopService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class ShopController {
  getAllShops = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { page = 1, limit = 10, status = "all" } = req.query;
      if (!page) {
        page = 1;
      }
      if (!limit) {
        limit = 10;
      }
      if (!status) {
        status = "all";
      }
      const shops = await shopService.getAllShops(
        parseInt(page as string),
        parseInt(limit as string),
        status as string
      );
      res.status(StatusCodes.OK).json({
        message: "Shops fetched successfully!",
        data: shops,
      });
    } catch (error) {
      next(error);
    }
  };

  getShopById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const shop = await shopService.getShopById(parseInt(id));
      res.status(StatusCodes.OK).json({
        message: "Shop fetched successfully!",
        data: shop,
      });
    } catch (error) {
      next(error);
    }
  };

  getProductsByShopId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const products = await shopService.getProductsByShopId(parseInt(id));
      res.status(StatusCodes.OK).json({
        message: "Products fetched successfully!",
        data: products,
      });
    } catch (error) {
      next(error);
    }
  };

  getProductsByShopIdForAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      let { page = 1, limit = 10 } = req.query;
      if (!page) {
        page = 1;
      }
      if (!limit) {
        limit = 10;
      }
      const { email } = req.jwtUser as UserInfoJwt;
      const products = await shopService.getProductsByShopIdForAdmin(
        parseInt(id),
        parseInt(page as string),
        parseInt(limit as string),
        email
      );
      res.status(StatusCodes.OK).json({
        message: "Products fetched successfully!",
        data: products,
      });
    } catch (error) {
      next(error);
    }
  };
  disableShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const shop = await shopService.disableShop(parseInt(id));
      res.status(StatusCodes.OK).json({
        message: "Shop disabled successfully!",
        data: shop,
      });
    } catch (error) {
      next(error);
    }
  };

  enableShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const shop = await shopService.enableShop(parseInt(id));
      res.status(StatusCodes.OK).json({
        message: "Shop enabled successfully!",
        data: shop,
      });
    } catch (error) {
      next(error);
    }
  };

  approveShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const shop = await shopService.approveShop(parseInt(id));
      res.status(StatusCodes.OK).json({
        message: "Shop approved successfully!",
        data: shop,
      });
    } catch (error) {
      next(error);
    }
  };

  rejectShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const shop = await shopService.rejectShop(parseInt(id));
      res.status(StatusCodes.OK).json({
        message: "Shop rejected successfully!",
        data: shop,
      });
    } catch (error) {
      next(error);
    }
  };
}

const shopController = new ShopController();

export default shopController;
