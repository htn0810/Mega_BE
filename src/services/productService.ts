import { TCreateProductRequest } from "@/types/product/product.type";
import { BadRequestError } from "@exceptions/BadRequestError";
import cloudinaryProvider from "@providers/CloudinaryProvider";
import productRepository from "@repositories/productRepository";
import { CLOUDINARY_FOLDER_NAME } from "@utils/constants";

class ProductService {
  async createProduct(
    productData: TCreateProductRequest,
    images: Express.Multer.File[]
  ) {
    let imageUrls: string[] = [];
    try {
      // Upload all images to cloudinary
      const uploadPromises = images.map((image) =>
        cloudinaryProvider.uploadImage(
          image.buffer,
          CLOUDINARY_FOLDER_NAME.PRODUCT
        )
      );

      // Wait for all uploads to complete
      imageUrls = await Promise.all(uploadPromises);

      // Join the URLs with commas
      const formattedImageUrls = imageUrls.join(", ");

      const product = await productRepository.createProduct({
        ...productData,
        imageUrls: formattedImageUrls,
      });
      return product;
    } catch (error) {
      imageUrls.forEach((imageUrl) => {
        cloudinaryProvider.deleteImage(
          imageUrl,
          CLOUDINARY_FOLDER_NAME.PRODUCT
        );
      });
      throw error;
    }
  }

  async getProducts(
    page: number,
    limit: number,
    categories: string[],
    rating: number,
    minPrice: number,
    maxPrice: number
  ) {
    try {
      const products = await productRepository.getProducts(
        page,
        limit,
        categories,
        rating,
        minPrice,
        maxPrice
      );
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

  async updateProduct(
    id: number,
    productData: TCreateProductRequest,
    images: Express.Multer.File[]
  ) {
    let newImageUrls: string[] = [];
    try {
      const existingProduct = await productRepository.getProductById(id);
      if (!existingProduct) {
        throw new BadRequestError(`Product not found with id: ${id}`);
      }

      let formattedImageUrls = existingProduct.imageUrls;

      // If new images are provided, delete old images and upload new ones
      if (images && images.length > 0) {
        // Delete all existing images from Cloudinary
        const previousImageUrls = existingProduct.imageUrls.split(", ");
        const deletePromises = previousImageUrls.map((imageUrl: string) =>
          cloudinaryProvider.deleteImage(
            imageUrl,
            CLOUDINARY_FOLDER_NAME.PRODUCT
          )
        );

        await Promise.all(deletePromises);

        // Upload new images
        const uploadPromises = images.map((image) =>
          cloudinaryProvider.uploadImage(
            image.buffer,
            CLOUDINARY_FOLDER_NAME.PRODUCT
          )
        );

        // Wait for all uploads to complete
        newImageUrls = await Promise.all(uploadPromises);

        // Join the URLs with commas
        formattedImageUrls = newImageUrls.join(", ");
      }

      // Update product with new data including the new image URLs if changed
      const product = await productRepository.updateProduct(id, {
        ...productData,
        imageUrls: formattedImageUrls,
      });

      return product;
    } catch (error) {
      newImageUrls.forEach((imageUrl) => {
        cloudinaryProvider.deleteImage(
          imageUrl,
          CLOUDINARY_FOLDER_NAME.PRODUCT
        );
      });
      throw error;
    }
  }

  async deleteProduct(id: number) {
    try {
      const existingProduct = await productRepository.getProductById(id);
      if (!existingProduct) {
        throw new BadRequestError(`Product not found with id: ${id}`);
      }

      // Beacause use soft delete, so we don't need to delete the images from Cloudinary
      // Delete all product images from Cloudinary
      // const imageUrls = existingProduct.imageUrls.split(", ");
      // const deletePromises = imageUrls.map((imageUrl: string) =>
      //   cloudinaryProvider.deleteImage(imageUrl, CLOUDINARY_FOLDER_NAME.PRODUCT)
      // );
      // await Promise.all(deletePromises);

      // Delete the product from database
      await productRepository.deleteProduct(id);
    } catch (error) {
      throw error;
    }
  }

  async enableProduct(id: number) {
    try {
      const product = await productRepository.getProductById(id);
      if (!product) {
        throw new BadRequestError(`Product not found with id: ${id}`);
      }
      await productRepository.enableProduct(id);
    } catch (error) {
      throw error;
    }
  }

  async disableProduct(id: number) {
    try {
      const product = await productRepository.getProductById(id);
      if (!product) {
        throw new BadRequestError(`Product not found with id: ${id}`);
      }
      await productRepository.disableProduct(id);
    } catch (error) {
      throw error;
    }
  }
}

const productService = new ProductService();

export default productService;
