import { CreateProductRequest } from "@models/product/product.type";
import cloudinaryProvider from "@providers/CloudinaryProvider";
import productRepository from "@repositories/productRepository";
import { CLOUDINARY_FOLDER_NAME } from "@utils/constants";
class ProductService {
  async createProduct(
    productData: CreateProductRequest,
    images: Express.Multer.File[]
  ) {
    try {
      //   let imageUrls = "";
      //   images.forEach(async (img) => {
      //     const url = await cloudinaryProvider.uploadImage(
      //       img.buffer,
      //       CLOUDINARY_FOLDER_NAME.PRODUCT
      //     );
      //     imageUrls += "," + url;
      //   })
      const product = await productRepository.createProduct({
        ...productData,
        // imageUrls: imageUrls,
        imageUrls: "aaa, aaaa",
      });
      return product;
    } catch (error) {
      console.log("🚀 ~ ProductService ~ error:", error);
      throw error;
    }
  }

  async getProductById(id: number) {
    const product = await productRepository.getProductById(id);
    return product;
  }
}

const productService = new ProductService();

export default productService;
