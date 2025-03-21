import cartService from "@services/cartService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email } = req.jwtUser as JwtPayload;
      const cart = await cartService.getCart(email);
      res.status(StatusCodes.OK).json({
        message: "Get list products in cart successfully!",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email } = req.jwtUser as JwtPayload;
      const { productId, quantity } = req.body;
      const cart = await cartService.addToCart(email, productId, quantity);
      res.status(StatusCodes.OK).json({
        message: "Add to cart successfully!",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const cart = await cartService.deleteCart(parseInt(id));
      res.status(StatusCodes.OK).json({
        message: "Delete cart successfully!",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }
}

const cartController = new CartController();
export default cartController;
