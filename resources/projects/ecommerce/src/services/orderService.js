const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const ApiError = require("../errors/ApiError");

class OrderService {
  async createOrderFromCart(userId, cartId, shippingAddress) {
    return prisma.$transaction(async (tx) => {
      // Get cart with items and their products
      const cart = await tx.cart.findUnique({
        where: { id: cartId, userId: parseInt(userId) },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      if (!cart || !cart.items?.length) {
        throw new ApiError(400, "Cart is empty", false);
      }

      // Calculate total amount
      let totalAmount = 0;
      for (const item of cart.items) {
        if (!item.product?.price) {
          throw new ApiError(400, `Product ${item.productId} has no price`, false);
        }
        totalAmount += Number(item.product.price) * item.quantity;
      }

      // Create order
      const order = await tx.order.create({
        data: {
          userId,
          status: "PENDING",
          totalAmount,
          shippingAddress,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price
            }))
          }
        },
        include: { items: true }
      });

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId } });
      return order;
    });
  }

  async updateOrderStatus(orderId, newStatus) {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!order) throw new ApiError(404, "Order not found", false);

    const validTransitions = {
      PENDING: ["PROCESSING", "CANCELLED"],
      PROCESSING: ["SHIPPED", "CANCELLED"],
      SHIPPED: ["DELIVERED"],
      CANCELLED: [],
    };

    if (!validTransitions[order.status]?.includes(newStatus)) {
      throw new ApiError(
        400,
        `Invalid status transition from ${order.status} to ${newStatus}`,
        false
      );
    }

    return prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status: newStatus },
    });
  }

  async getOrders(userId) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  }
}

module.exports = new OrderService();
