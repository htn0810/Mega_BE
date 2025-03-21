import { GET_DB } from "@configs/database";

class CartRepository {
  async getCartByUserId(userId: number) {
    try {
      const cart = await GET_DB().carts.findUnique({
        where: { userId },
        include: {
          cartProducts: {
            include: {
              product: true,
            },
          },
        },
      });
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async createCart(userId: number) {
    try {
      const cart = await GET_DB().carts.create({
        data: {
          userId,
        },
      });
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async createCartProduct(cartId: number, productId: number, quantity: number) {
    try {
      const cartProduct = await GET_DB().cartProducts.create({
        data: {
          cartId,
          productId,
          quantity,
        },
      });
      return cartProduct;
    } catch (error) {
      throw error;
    }
  }

  async updateCartProduct(cartId: number, productId: number, quantity: number) {
    try {
      // First find the cart product by cartId and productId
      const existingCartProduct = await GET_DB().cartProducts.findFirst({
        where: {
          cartId,
          productId,
        },
      });

      if (!existingCartProduct) {
        throw new Error("Cart product not found");
      }

      // Then update it using its ID
      const cartProduct = await GET_DB().cartProducts.update({
        where: { id: existingCartProduct.id },
        data: { quantity },
      });
      return cartProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteCart(id: number) {
    try {
      const cart = await GET_DB().carts.delete({
        where: { id },
      });
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async increaseProductQuantityByOne(cartId: number, productId: number) {
    try {
      // Find the cart product
      const cartProduct = await GET_DB().cartProducts.findFirst({
        where: {
          cartId,
          productId,
        },
      });

      if (!cartProduct) {
        throw new Error("Cart product not found");
      }

      // Increase quantity by 1
      const updatedCartProduct = await GET_DB().cartProducts.update({
        where: { id: cartProduct.id },
        data: { quantity: cartProduct.quantity + 1 },
      });

      return updatedCartProduct;
    } catch (error) {
      throw error;
    }
  }

  async decreaseProductQuantityByOne(cartId: number, productId: number) {
    try {
      // Find the cart product
      const cartProduct = await GET_DB().cartProducts.findFirst({
        where: {
          cartId,
          productId,
        },
      });

      if (!cartProduct) {
        throw new Error("Cart product not found");
      }

      // If quantity is 1, remove product from cart
      if (cartProduct.quantity === 1) {
        await GET_DB().cartProducts.delete({
          where: { id: cartProduct.id },
        });
        return null; // Return null to indicate product was removed
      }

      // Otherwise decrease quantity by 1
      const updatedCartProduct = await GET_DB().cartProducts.update({
        where: { id: cartProduct.id },
        data: { quantity: cartProduct.quantity - 1 },
      });

      return updatedCartProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteProductFromCart(cartId: number, productId: number) {
    try {
      // Find the cart product
      const cartProduct = await GET_DB().cartProducts.findFirst({
        where: {
          cartId,
          productId,
        },
      });

      if (!cartProduct) {
        throw new Error("Cart product not found");
      }

      // Delete the cart product
      await GET_DB().cartProducts.delete({
        where: { id: cartProduct.id },
      });

      return true; // Return true to indicate successful deletion
    } catch (error) {
      throw error;
    }
  }
}

const cartRepository = new CartRepository();
export default cartRepository;
