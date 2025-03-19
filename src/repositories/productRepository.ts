import { GET_DB } from "@configs/database";
import { CreateProductDTO } from "@models/product/product.type";

class ProductRepository {
  async createProduct(productData: CreateProductDTO) {
    console.log(
      "🚀 ~ ProductRepository ~ createProduct ~ productData:",
      productData
    );
    return await GET_DB().$transaction(async (tx) => {
      // 1. Tạo sản phẩm
      const product = await tx.products.create({
        data: {
          name: productData.name,
          description: productData.description,
          imageUrls: productData.imageUrls,
          shopId: productData.shopId,
          categoryId: productData.categoryId,
        },
      });
      console.log(
        "🚀 ~ ProductRepository ~ returnawaitGET_DB ~ product:",
        product
      );

      // 2. Tạo thuộc tính và giá trị
      for (const attr of productData.attributes) {
        const attribute = await tx.productAttributes.create({
          data: {
            name: attr.name,
            productId: product.id,
            values: {
              create: attr.values.map((value) => ({
                value: value,
              })),
            },
          },
        });
        console.log(
          "🚀 ~ ProductRepository ~ returnawaitGET_DB ~ attribute:",
          attribute
        );
      }

      // 3. Tạo biến thể và liên kết với giá trị thuộc tính
      for (const variant of productData.variants) {
        // Tìm các giá trị thuộc tính tương ứng
        const attributeValues = await Promise.all(
          variant.attributes.map(async (attr) => {
            const attribute = await tx.productAttributes.findFirst({
              where: {
                productId: product.id,
                name: attr.name,
              },
            });

            if (!attribute) {
              throw new Error(`Attribute ${attr.name} not found`);
            }

            const value = await tx.attributeValues.findFirst({
              where: {
                attributeId: attribute.id,
                value: attr.value,
              },
            });

            if (!value) {
              throw new Error(
                `Value ${attr.value} not found for attribute ${attr.name}`
              );
            }

            return value.id;
          })
        );

        // Tạo biến thể và liên kết với các giá trị thuộc tính
        await tx.productVariants.create({
          data: {
            price: variant.price,
            stock: variant.stock,
            productId: product.id,
            attributeValues: {
              create: attributeValues.map((attributeValueId) => ({
                attributeValueId,
              })),
            },
          },
        });
      }

      return product;
    });
  }

  async getProductById(productId: number) {
    return await GET_DB().products.findUnique({
      where: {
        id: productId,
      },
      select: {
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
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getProducts(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      GET_DB().products.findMany({
        skip,
        take: limit,
        select: {
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
                    },
                  },
                },
              },
            },
          },
        },
      }),
      GET_DB().products.count(),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

const productRepository = new ProductRepository();

export default productRepository;
