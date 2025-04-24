const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v7: uuid } = require('uuid');

class CartService {
  async getOrCreateCart(userId) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          items: { create: [] }
        },
        include: { items: true }
      });
    }

    return cart;
  }

  async addItem(userId, productId, quantity = 1) {
    const cart = await this.getOrCreateCart(userId);

    const existingItem = cart.items.find(item => item.productId === productId);
    
    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity
      }
    });
  }

  async removeItem(userId, productId) {
    const cart = await this.getOrCreateCart(userId);
    
    return prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId
      }
    });
  }

  async clearCart(userId) {
    const cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
      
      return prisma.cart.delete({
        where: { id: cart.id }
      });
    }

    return null;
  }
}

module.exports = new CartService();
