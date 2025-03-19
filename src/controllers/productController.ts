import productService from "@services/productService";
import { NextFunction, Request, Response } from "express";

class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const images = req.files;
      console.log("🚀 ~ ProductController ~ createProduct= ~ images:", images);
      const { productData } = req.body;
      const product = await productService.createProduct(
        JSON.parse(productData),
        images as Express.Multer.File[]
      );
      res.status(201).json({
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(parseInt(id));
      res.status(200).json({
        message: "Product fetched successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
}

const productController = new ProductController();

export default productController;
