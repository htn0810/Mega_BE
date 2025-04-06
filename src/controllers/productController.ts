import productService from "@services/productService";
import { NextFunction, Request, Response } from "express";

class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const images = req.files;
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

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = 1,
        limit = 10,
        categoryIds,
        rating,
        minPrice,
        maxPrice,
        bestSelling,
        newest,
        sortPrice,
      } = req.query;
      const products = await productService.getProducts(
        parseInt(page as string),
        parseInt(limit as string),
        categoryIds?.toString().split(",") || [],
        parseInt(rating as string),
        parseInt(minPrice as string),
        parseInt(maxPrice as string),
        bestSelling === "true",
        newest === "true",
        sortPrice as "asc" | "desc"
      );
      res.status(200).json({
        message: "Products fetched successfully",
        data: products,
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

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const images = req.files as Express.Multer.File[] | undefined;
      const { productData } = req.body;

      const product = await productService.updateProduct(
        parseInt(id),
        JSON.parse(productData),
        images || []
      );

      res.status(200).json({
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(parseInt(id));
      res.status(200).json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async disableProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await productService.disableProduct(parseInt(id));
      res.status(200).json({
        message: "Product disabled successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async enableProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await productService.enableProduct(parseInt(id));
      res.status(200).json({
        message: "Product enabled successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

const productController = new ProductController();

export default productController;
