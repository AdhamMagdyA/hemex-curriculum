const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
      success_url: `${process.env.BASE_URL}/success`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
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

}

module.exports = new PaymentService();

