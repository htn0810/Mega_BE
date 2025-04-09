import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mega Shop API",
      version: "1.0.0",
      description: "API for Mega Shop E-commerce Platform",
      contact: {
        name: "API Support",
        email: "support@megashop.com",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // Common schemas
        Pagination: {
          type: "object",
          properties: {
            total: { type: "integer", description: "Total number of items" },
            page: { type: "integer", description: "Current page number" },
            limit: { type: "integer", description: "Number of items per page" },
            pages: { type: "integer", description: "Total number of pages" },
          },
        },

        // User schemas
        User: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int64" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            avatarUrl: { type: "string", nullable: true },
            isVerified: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            roles: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Role",
              },
            },
            shop: {
              $ref: "#/components/schemas/Shop",
            },
          },
        },
        Role: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int64" },
            name: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        UserRoles: {
          type: "object",
          properties: {
            userId: { type: "integer", format: "int64" },
            roleId: { type: "integer", format: "int64" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            role: {
              $ref: "#/components/schemas/Role",
            },
          },
        },

        // Address schemas
        Address: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int64" },
            userId: { type: "integer", format: "int64" },
            name: { type: "string" },
            phoneNumber: { type: "string" },
            provinceCode: { type: "string" },
            districtCode: { type: "string" },
            wardCode: { type: "string" },
            street: { type: "string" },
            isDefault: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        AddressInput: {
          type: "object",
          required: [
            "name",
            "phoneNumber",
            "provinceCode",
            "districtCode",
            "wardCode",
            "street",
          ],
          properties: {
            name: { type: "string" },
            phoneNumber: { type: "string" },
            provinceCode: { type: "string" },
            districtCode: { type: "string" },
            wardCode: { type: "string" },
            street: { type: "string" },
            isDefault: { type: "boolean" },
          },
        },

        // Shop schemas
        Shop: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int64" },
            name: { type: "string" },
            description: { type: "string" },
            avatarUrl: { type: "string" },
            coverUrl: { type: "string" },
            status: {
              type: "string",
              enum: ["PENDING", "ACTIVE", "REJECTED", "DISABLED"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ShopInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
          },
        },
        ShopUpdateInput: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
          },
        },

        // Product schemas
        Product: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int64" },
            name: { type: "string" },
            description: { type: "string" },
            imageUrls: {
              type: "array",
              items: { type: "string" },
            },
            price: { type: "number", format: "float" },
            stock: { type: "integer" },
            rating: { type: "number", nullable: true },
            slug: { type: "string" },
            shopId: { type: "integer", format: "int64" },
            categoryId: { type: "integer", format: "int64" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ProductInput: {
          type: "object",
          required: ["name", "description", "price", "categoryId", "shopId"],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number", format: "float" },
            stock: { type: "integer" },
            categoryId: { type: "integer", format: "int64" },
            shopId: { type: "integer", format: "int64" },
          },
        },

        // Category schemas
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int64" },
            name: { type: "string" },
            parentId: { type: "integer", format: "int64", nullable: true },
            imageUrl: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        // Cart schemas
        Cart: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int64" },
            userId: { type: "integer", format: "int64" },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/CartItem",
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int64" },
            cartId: { type: "integer", format: "int64" },
            productId: { type: "integer", format: "int64" },
            quantity: { type: "integer" },
            product: {
              $ref: "#/components/schemas/Product",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        // Discount schemas
        Discount: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int64" },
            name: { type: "string" },
            description: { type: "string" },
            discountCode: { type: "string" },
            discountType: {
              type: "string",
              enum: ["PERCENTAGE", "FIXED"],
            },
            discountValue: { type: "number", format: "float" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            maxUsage: { type: "integer" },
            usageCount: { type: "integer" },
            minOrderAmount: { type: "number", format: "float" },
            discountMaxUsePerUser: { type: "integer" },
            discountAppliesTo: {
              type: "string",
              enum: ["ALL", "SPECIFIC_PRODUCTS"],
            },
            shopId: { type: "integer", format: "int64" },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        DiscountInput: {
          type: "object",
          required: [
            "name",
            "shopId",
            "description",
            "discountCode",
            "discountType",
            "discountValue",
            "startDate",
            "endDate",
            "maxUsage",
            "minOrderAmount",
            "discountMaxUsePerUser",
            "discountAppliesTo",
          ],
          properties: {
            name: { type: "string" },
            shopId: { type: "integer", format: "int64" },
            description: { type: "string" },
            discountCode: { type: "string" },
            discountType: {
              type: "string",
              enum: ["PERCENTAGE", "FIXED"],
            },
            discountValue: { type: "number", format: "float" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            maxUsage: { type: "integer" },
            minOrderAmount: { type: "number", format: "float" },
            discountMaxUsePerUser: { type: "integer" },
            discountAppliesTo: {
              type: "string",
              enum: ["ALL", "SPECIFIC_PRODUCTS"],
            },
            discountAppliesToProducts: {
              type: "array",
              items: { type: "integer", format: "int64" },
            },
          },
        },

        // Error responses
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:8080/mega/v1",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "System",
        description: "System operations",
      },
      {
        name: "Users",
        description: "User management operations",
      },
      {
        name: "Addresses",
        description: "Address management operations",
      },
      {
        name: "Products",
        description: "Product management operations",
      },
      {
        name: "Categories",
        description: "Category management operations",
      },
      {
        name: "Shops",
        description: "Shop management operations",
      },
      {
        name: "Carts",
        description: "Shopping cart operations",
      },
      {
        name: "Discounts",
        description: "Discount management operations",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app: Express, port: number) => {
  // Swagger setup
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Mega Shop API Documentation",
      customfavIcon: "/favicon.ico",
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: "alpha",
        operationsSorter: "alpha",
        docExpansion: "none",
      },
    })
  );

  // Docs in JSON format
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`📚 Swagger docs available at http://localhost:${port}/docs`);
};
