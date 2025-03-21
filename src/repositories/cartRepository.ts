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
      const cartProduct = await GET_DB().cartProducts.update({
        where: { cartId, productId },
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
}

const cartRepository = new CartRepository();
export default cartRepository;
