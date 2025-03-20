import { GET_DB } from "@configs/database";
import { CreateProductDTO } from "@models/product/product.type";

// Shared select object for reuse
const productSelect = {
  id: true,
  name: true,
  description: true,
  imageUrls: true,
  shopId: true,
  categoryId: true,
  attributes: {
    select: {
      id: true,
      name: true,
      values: {
        select: {
          id: true,
          value: true,
        },
      },
    },
  },
  variants: {
    select: {
      id: true,
      price: true,
      stock: true,
      attributeValues: {
        select: {
          attributeValue: {
            select: {
              id: true,
              value: true,
              attribute: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  },
} as const;

// Shared transformation function
function transformProduct(product: any) {
  if (!product) return null;

  return {
    ...product,
    variants: product.variants.map((variant: any) => ({
      id: variant.id,
      price: variant.price,
      stock: variant.stock,
      attributeValues: variant.attributeValues.map((av: any) => ({
        id: av.attributeValue.id,
        name: av.attributeValue.attribute.name,
        value: av.attributeValue.value,
      })),
    })),
  };
}

class ProductRepository {
  async createProduct(productData: CreateProductDTO) {
    return await GET_DB().$transaction(async (tx) => {
      try {
        // 1. Create product
        const product = await tx.products.create({
          data: {
            name: productData.name,
            description: productData.description,
            imageUrls: productData.imageUrls,
            shopId: productData.shopId,
            categoryId: productData.categoryId,
          },
        });

        // 2. Batch create attributes and their values
        const attributePromises = productData.attributes.map((attr) =>
          tx.productAttributes.create({
            data: {
              name: attr.name,
              productId: product.id,
              values: {
                create: attr.values.map((value) => ({ value })),
              },
            },
            include: {
              values: true,
            },
          })
        );

        const attributes = await Promise.all(attributePromises);

        // Create a map for quick attribute value lookup
        const attributeValueMap = new Map(
          attributes.flatMap((attr) =>
            attr.values.map((value) => [
              `${attr.name}-${value.value}`,
              value.id,
            ])
          )
        );

        // 3. Batch create variants
        const variantPromises = productData.variants.map(async (variant) => {
          const attributeValueIds = variant.attributes.map((attr) => {
            const valueId = attributeValueMap.get(`${attr.name}-${attr.value}`);
            if (!valueId) {
              throw new Error(
                `Invalid attribute combination: ${attr.name}-${attr.value}`
              );
            }
            return valueId;
          });

          return tx.productVariants.create({
            data: {
              price: variant.price,
              stock: variant.stock,
              productId: product.id,
              attributeValues: {
                create: attributeValueIds.map((attributeValueId) => ({
                  attributeValueId,
                })),
              },
            },
          });
        });

        await Promise.all(variantPromises);

        return product;
      } catch (error) {
        // Log error for monitoring but throw a sanitized error
        console.error("Product creation failed:", error);
        throw new Error("Failed to create product");
      }
    });
  }

  async getProductById(productId: number) {
    if (!productId || productId <= 0) {
      throw new Error("Invalid product ID");
    }

    try {
      const product = await GET_DB().products.findUnique({
        where: { id: productId },
        select: productSelect,
      });

      return transformProduct(product);
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
      // Use queryRaw for count if performance is critical
      const [products, total] = await Promise.all([
        GET_DB().products.findMany({
          skip,
          take: validatedLimit,
          select: productSelect,
          orderBy: { id: "desc" }, // Add sorting for consistency
        }),
        GET_DB().products.count(),
      ]);

      return {
        products: products.map(transformProduct),
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
      await GET_DB().products.delete({ where: { id: productId } });
    } catch (error) {
      throw new Error(error as string);
    }
  }
}

const productRepository = new ProductRepository();

export default productRepository;
