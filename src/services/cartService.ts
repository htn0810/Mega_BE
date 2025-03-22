import { BadRequestError } from "@exceptions/BadRequestError";
import { Prisma } from "@prisma/client";
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
      const cartInfo = await cartRepository.getCartByUserId(user.id);
      const formattedCart = await this.formatCart(cartInfo);
      return formattedCart;
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
      const cartInfo = await cartRepository.getCartByUserId(user.id);
      const formattedCart = await this.formatCart(cartInfo);
      return formattedCart;
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

  async increaseProductQuantity(email: string, productId: number) {
    try {
      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        throw new BadRequestError("User not found");
      }

      const cart = await cartRepository.getCartByUserId(user.id);
      if (!cart) {
        throw new BadRequestError("Cart not found");
      }

      // Find product in cart
      const productInCart = cart.cartProducts.find(
        (item) => item.productId === productId
      );

      if (!productInCart) {
        throw new BadRequestError("Product not in cart");
      }

      if (productInCart.quantity + 1 > productInCart.product.stock) {
        throw new BadRequestError("Product quantity is exceeded the stock");
      }

      // Increase product quantity
      await cartRepository.increaseProductQuantityByOne(cart.id, productId);

      // Get updated cart
      const cartInfo = await cartRepository.getCartByUserId(user.id);
      const formattedCart = await this.formatCart(cartInfo);
      return formattedCart;
    } catch (error) {
      throw error;
    }
  }

  async decreaseProductQuantity(email: string, productId: number) {
    try {
      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        throw new BadRequestError("User not found");
      }

      const cart = await cartRepository.getCartByUserId(user.id);
      if (!cart) {
        throw new BadRequestError("Cart not found");
      }

      // Find product in cart
      const productInCart = cart.cartProducts.find(
        (item) => item.productId === productId
      );

      if (!productInCart) {
        throw new BadRequestError("Product not in cart");
      }

      // Decrease product quantity (will be removed if quantity becomes 0)
      await cartRepository.decreaseProductQuantityByOne(cart.id, productId);

      // Get updated cart
      const cartInfo = await cartRepository.getCartByUserId(user.id);
      const formattedCart = await this.formatCart(cartInfo);
      return formattedCart;
    } catch (error) {
      throw error;
    }
  }

  async removeProductFromCart(email: string, productId: number) {
    try {
      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        throw new BadRequestError("User not found");
      }

      const cart = await cartRepository.getCartByUserId(user.id);
      if (!cart) {
        throw new BadRequestError("Cart not found");
      }

      // Find product in cart
      const productInCart = cart.cartProducts.find(
        (item) => item.productId === productId
      );

      if (!productInCart) {
        throw new BadRequestError("Product not in cart");
      }

      // Remove product from cart
      await cartRepository.deleteProductFromCart(cart.id, productId);

      // Get updated cart
      const cartInfo = await cartRepository.getCartByUserId(user.id);
      const formattedCart = await this.formatCart(cartInfo);
      return formattedCart;
    } catch (error) {
      throw error;
    }
  }

  async formatCart(
    cart: Prisma.CartsGetPayload<{
      include: {
        cartProducts: {
          include: {
            product: true;
          };
        };
      };
    }> | null
  ) {
    if (!cart) {
      return null;
    }
    const totalPrice = cart.cartProducts.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);
    const totalQuantity = cart.cartProducts.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
    const formattedCart = {
      id: cart.id,
      userId: cart.userId,
      totalPrice,
      totalQuantity,
      cartProducts: cart.cartProducts.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        name: item.product.name,
        image: item.product.imageUrls?.split(",")[0],
        stock: item.product.stock,
      })),
    };

    return formattedCart;
  }
}

const cartService = new CartService();
export default cartService;
