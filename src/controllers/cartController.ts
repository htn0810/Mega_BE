import cartService from "@services/cartService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.jwtUser as JwtPayload;
      const cart = await cartService.getCart(userId);
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

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { id: userId } = req.jwtUser as JwtPayload;
      const cart = await cartService.clearCart(parseInt(id), userId);
      res.status(StatusCodes.OK).json({
        message: "Clear cart successfully!",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async increaseProductQuantity(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name, email } = req.jwtUser as JwtPayload;
      const { productId } = req.body;

      const cart = await cartService.increaseProductQuantity(
        email,
        parseInt(productId)
      );

      res.status(StatusCodes.OK).json({
        message: "Product quantity increased successfully!",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async decreaseProductQuantity(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name, email } = req.jwtUser as JwtPayload;
      const { productId } = req.body;

      const cart = await cartService.decreaseProductQuantity(
        email,
        parseInt(productId)
      );

      res.status(StatusCodes.OK).json({
        message: "Product quantity decreased successfully!",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeProductFromCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email } = req.jwtUser as JwtPayload;
      const { productId } = req.body;

      const cart = await cartService.removeProductFromCart(
        email,
        parseInt(productId)
      );

      res.status(StatusCodes.OK).json({
        message: "Product removed from cart successfully!",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }
}

const cartController = new CartController();
export default cartController;
