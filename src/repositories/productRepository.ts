import { CreateProductDTO } from "@/types/product/product.type";
import { GET_DB } from "@configs/database";

class ProductRepository {
  async createProduct(productData: CreateProductDTO) {
    try {
      const product = await GET_DB().products.create({
        data: {
          name: productData.name,
          description: productData.description,
          imageUrls: productData.imageUrls,
          price: productData.price || 0,
          stock: productData.stock || 0,
          rating: productData.rating,
          slug: productData.slug,
          shopId: productData.shopId,
          categoryId: productData.categoryId,
        },
      });

      return product;
    } catch (error) {
      console.error("Product creation failed:", error);
      throw new Error("Failed to create product");
    }
  }

  async getProductById(productId: number) {
    if (!productId || productId <= 0) {
      throw new Error("Invalid product ID");
    }

    try {
      const product = await GET_DB().products.findUnique({
        where: { id: productId },
      });

      return product;
    } catch (error) {
      throw new Error("Failed to fetch product");
    }
  }

  async getProducts(page: number = 1, limit: number = 10) {
    // Input validation
    const validatedPage = Math.max(1, Math.floor(page));
    const validatedLimit = Math.min(50, Math.max(1, Math.floor(limit)));
    const skip = (validatedPage - 1) * validatedLimit;

    try {
      const [products, total] = await Promise.all([
        GET_DB().products.findMany({
          skip,
          take: validatedLimit,
          orderBy: { id: "desc" },
        }),
        GET_DB().products.count(),
      ]);

      return {
        products: products,
        pagination: {
          page: validatedPage,
          limit: validatedLimit,
          total,
          totalPages: Math.ceil(total / validatedLimit),
        },
      };
    } catch (error) {
      throw new Error("Failed to fetch products");
    }
  }

  async deleteProduct(productId: number) {
    try {
      await GET_DB().products.update({
        where: { id: productId },
        data: {
          isDeleted: true,
        },
      });
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete product: ${error}`);
    }
  }

  async updateProduct(
    productId: number,
    productData: Partial<CreateProductDTO>
  ) {
    try {
      // Build the update data
      const updateData: Partial<CreateProductDTO> = {};

      if (productData.name !== undefined) updateData.name = productData.name;
      if (productData.description !== undefined)
        updateData.description = productData.description;
      if (productData.imageUrls !== undefined)
        updateData.imageUrls = productData.imageUrls;
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.stock !== undefined) updateData.stock = productData.stock;
      if (productData.rating !== undefined)
        updateData.rating = productData.rating;
      if (productData.slug !== undefined) updateData.slug = productData.slug;
      if (productData.categoryId !== undefined)
        updateData.categoryId = productData.categoryId;
      if (productData.shopId !== undefined)
        updateData.shopId = productData.shopId;

      // Update the product
      const updatedProduct = await GET_DB().products.update({
        where: { id: productId },
        data: updateData,
      });

      return updatedProduct;
    } catch (error) {
      throw new Error("Failed to update product");
    }
  }

  async enableProduct(productId: number) {
    try {
      await GET_DB().products.update({
        where: { id: productId },
        data: {
          isActive: true,
        },
      });
    } catch (error) {
      throw new Error("Failed to enable product");
    }
  }

  async disableProduct(productId: number) {
    try {
      await GET_DB().products.update({
        where: { id: productId },
        data: {
          isActive: false,
        },
      });
    } catch (error) {
      throw new Error("Failed to disable product");
    }
  }
}

const productRepository = new ProductRepository();

export default productRepository;
