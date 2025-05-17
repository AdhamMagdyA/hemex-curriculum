const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const NotificationService = require('./notificationService');
const { baseUrl, stripeSecretKey } = require('../config');
const stripe = require('stripe')(stripeSecretKey);

class PaymentService {

  async createCheckoutSession(orderId) {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { items: { include: { product: true } } }
    });

    const lineItems = order.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
        },
        unit_amount: item.product.price * 100,
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
      // shipping_address_collection: {
      //   allowed_countries: ['US', 'CA']
      // },
      customer_email: (await prisma.user.findUnique({ where: { id: order.userId } })).email,
      metadata: {
        orderId
      }
    });

    return session;
  }

  async handleWebhook(request) {
    const event = request.body;
    
    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata.orderId;

        // Get the order and user
        const order = await prisma.order.findUnique({
          where: { id: parseInt(orderId) },
          include: {
            user: true,
            items: {
              include: {
                product: true
              }
            }
          }
        });

        if (!order) {
          throw new Error('Order not found');
        }

        // Create payment record
        await prisma.payment.create({
          data: {
            orderId: parseInt(orderId),
            amount: order.totalAmount,
            currency: session.currency,
            status: 'completed',
            gatewayId: session.payment_intent
          }
        });

        // Update order status
        await prisma.order.update({
          where: { id: parseInt(orderId) },
          data: {
            checkoutSessionId: session.id,
            paymentIntentId: session.payment_intent,
            status: 'Processing'
          }
        });

        // Send notifications
        NotificationService.createNotification(order.user.id, 'order_confirmation', `Your order ${order.id} has been confirmed`);
        await NotificationService.sendOrderConfirmationEmail(order, order.user);
        await NotificationService.sendAdminNotification(order);
      }
      
      return true;
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

}

module.exports = new PaymentService();

