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

  async handleWebhook(request) {
    let event = request.body;

    
    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata.orderId;
        
        // Extract payment data from the session
        const paymentData = {
          checkoutSessionId: session.id,
          paymentIntentId: session.payment_intent,
          status: 'Processing'
        };

        // Get the order to get total amount and other details
        const order = await prisma.order.findUnique({
          where: { id: parseInt(orderId) }
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

        // Update order with payment data
        await prisma.order.update({
          where: { id: parseInt(orderId) },
          data: paymentData
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

}

module.exports = new PaymentService();

