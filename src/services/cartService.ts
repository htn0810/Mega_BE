import { BadRequestError } from "@exceptions/BadRequestError";
import cartRepository from "@repositories/cartRepository";
import userRepository from "@repositories/userRepository";

class CartService {
  async addToCart(email: string, productId: number, quantity: number) {
    try {
      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        throw new BadRequestError("User not found");
      }

      const cart = await cartRepository.getCartByUserId(user.id);
      if (!cart) {
        // Create new cart
        const newCart = await cartRepository.createCart(user.id);

        // Create new cart product
        await cartRepository.createCartProduct(newCart.id, productId, quantity);

        return await cartRepository.getCartByUserId(user.id);
      }

      // Existing cart, check if product already in cart
      const productInCart = cart.cartProducts.find(
        (item) => item.productId === productId
      );
      // If product already in cart, update quantity
      if (productInCart) {
        // Update quantity
        const updatedCart = await cartRepository.updateCartProduct(
          cart.id,
          productInCart.id,
          productInCart.quantity + 1
        );
        return updatedCart;
      }

      // Add new product to cart
      const newCartProduct = await cartRepository.createCartProduct(
        cart.id,
        productId,
        quantity
      );
      return await cartRepository.getCartByUserId(user.id);
    } catch (error) {
      throw error;
    }
  }

  async getCart(email: string) {
    try {
      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        throw new BadRequestError("User not found");
      }
      return await cartRepository.getCartByUserId(user.id);
    } catch (error) {
      throw error;
    }
  }

  async deleteCart(id: number) {
    try {
      const cart = await cartRepository.deleteCart(id);
      return cart;
    } catch (error) {
      throw error;
    }
  }
}

const cartService = new CartService();
export default cartService;
