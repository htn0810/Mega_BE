import { BadRequestError } from "@exceptions/BadRequestError";
import { Prisma } from "@prisma/client";
import cartRepository from "@repositories/cartRepository";
import userRepository from "@repositories/userRepository";

class CartService {
  async addToCart(userId: number, productId: number, quantity: number) {
    try {
      const user = await userRepository.getUserById(userId);
      if (!user) {
        throw new BadRequestError("User not found");
      }

      const cart = await cartRepository.getCartByUserId(user.id);
      if (!cart) {
        // Create new cart
        const newCart = await cartRepository.createCart(user.id);

        // Create new cart product
        await cartRepository.createCartProduct(newCart.id, productId, quantity);

        const cartInfo = await cartRepository.getCartByUserId(user.id);
        const formattedCart = await this.formatCart(cartInfo);
        return formattedCart;
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
          productInCart.productId,
          productInCart.quantity + quantity
        );
        const cartInfo = await cartRepository.getCartByUserId(user.id);
        const formattedCart = await this.formatCart(cartInfo);
        return formattedCart;
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

  async getCart(userId: number) {
    try {
      const user = await userRepository.getUserById(userId);
      if (!user) {
        throw new BadRequestError("User not found");
      }
      let cart = await cartRepository.getCartByUserId(user.id);
      if (!cart) {
        // Create new cart
        const createdCart = await cartRepository.createCart(user.id);
        if (!createdCart) {
          throw new BadRequestError("Failed to create cart");
        }
        cart = await cartRepository.getCartById(createdCart.id);
      }
      const formattedCart = await this.formatCart(cart);
      return formattedCart;
    } catch (error) {
      throw error;
    }
  }

  async clearCart(id: number, userId: number) {
    try {
      const existingCart = await cartRepository.getCartById(id);
      if (!existingCart) {
        throw new BadRequestError("Cart not found");
      }

      if (existingCart.userId !== userId) {
        throw new BadRequestError("You are not authorized to clear this cart");
      }

      const cart = await cartRepository.clearCart(id);
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async increaseProductQuantity(userId: number, productId: number) {
    try {
      const user = await userRepository.getUserById(userId);
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

  async decreaseProductQuantity(userId: number, productId: number) {
    try {
      const user = await userRepository.getUserById(userId);
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

  async removeProductFromCart(userId: number, productId: number) {
    try {
      const user = await userRepository.getUserById(userId);
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

  async removeAllProductsOfShop(userId: number, shopId: number) {
    try {
      const user = await userRepository.getUserById(userId);
      if (!user) {
        throw new BadRequestError("User not found");
      }

      const cart = await cartRepository.getCartByUserId(user.id);
      if (!cart) {
        throw new BadRequestError("Cart not found");
      }

      const productsBelongToShop = cart.cartProducts.filter(
        (item) => item.product.shopId === shopId
      );

      if (productsBelongToShop.length === 0) {
        throw new BadRequestError("No products found in cart");
      }

      const cartProductIds = productsBelongToShop.map((item) => item.productId);

      await cartRepository.deleteProductsOfShop(cart.id, cartProductIds);

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
            product: {
              include: {
                shop: true;
              };
            };
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
        shopId: item.product.shopId,
        shopName: item.product.shop.name,
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
