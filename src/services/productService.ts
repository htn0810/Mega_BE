import { TCreateProductRequest } from "@models/product/product.type";
import cloudinaryProvider from "@providers/CloudinaryProvider";
import productRepository from "@repositories/productRepository";
import { CLOUDINARY_FOLDER_NAME } from "@utils/constants";

class ProductService {
  async createProduct(
    productData: TCreateProductRequest,
    images: Express.Multer.File[]
  ) {
    try {
      // Upload all images to cloudinary
      const uploadPromises = images.map((image) =>
        cloudinaryProvider.uploadImage(
          image.buffer,
          CLOUDINARY_FOLDER_NAME.PRODUCT
        )
      );

      // Wait for all uploads to complete
      const imageUrls = await Promise.all(uploadPromises);

      // Join the URLs with commas
      const formattedImageUrls = imageUrls.join(", ");

      const product = await productRepository.createProduct({
        ...productData,
        imageUrls: formattedImageUrls,
      });
      return product;
    } catch (error) {
      throw error;
    }
  }

  async getProducts(page: number, limit: number) {
    try {
      const products = await productRepository.getProducts(page, limit);
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id: number) {
    try {
      const product = await productRepository.getProductById(id);
      return product;
    } catch (error) {
      throw error;
    }
  }
}

const productService = new ProductService();

export default productService;
