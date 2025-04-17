# Payment Processing & Integration

## Learning Objectives
By the end of this lesson, students will be able to:
- Integrate Stripe payment processing
- Handle payment webhooks
- Implement payment status management
- Handle refunds and disputes
- Secure payment data

## Prerequisites
- Order management system
- Stripe account
- Webhook setup knowledge
- SSL/TLS understanding

## Lesson Content

### 1. Payment Schema Updates
```prisma
// schema.prisma
model Payment {
    id              String          @id @default(uuid())
    order           Order           @relation(fields: [orderId], references: [id])
    orderId         String          @unique
    amount          Decimal         @db.Decimal(10, 2)
    currency        String          @default("USD")
    status          PaymentStatus
    paymentMethod   PaymentMethod?  @relation(fields: [paymentMethodId], references: [id])
    paymentMethodId String?
    paymentIntentId String?         @unique
    refundId        String?
    error           String?
    metadata        Json?
    createdAt       DateTime        @default(now())
    updatedAt       DateTime        @updatedAt

    @@index([paymentIntentId])
}

model PaymentMethod {
    id              String    @id @default(uuid())
    user            User      @relation(fields: [userId], references: [id])
    userId          Int
    type            String    // credit_card, paypal, etc.
    provider        String    // stripe, paypal, etc.
    last4           String?
    expiryMonth     Int?
    expiryYear      Int?
    brand           String?
    isDefault       Boolean   @default(false)
    payments        Payment[]
    createdAt       DateTime  @default(now())
    updatedAt       DateTime  @updatedAt

    @@index([userId])
}
```

### 2. Stripe Service Implementation
```typescript
// services/stripe.service.ts
import Stripe from 'stripe';
import { PaymentDTO } from '../types';

export class StripeService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2023-10-16'
        });
    }

    async createPaymentIntent(data: PaymentDTO) {
        const { amount, currency, customerId, paymentMethodId } = data;

        return this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            customer: customerId,
            payment_method: paymentMethodId,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            }
        });
    }

    async handleWebhook(
        signature: string,
        payload: Buffer
    ): Promise<WebhookHandlerResult> {
        try {
            const event = this.stripe.webhooks.constructEvent(
                payload,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );

            switch (event.type) {
                case 'payment_intent.succeeded':
                    return this.handlePaymentSuccess(event.data.object);
                
                case 'payment_intent.payment_failed':
                    return this.handlePaymentFailure(event.data.object);
                
                case 'charge.refunded':
                    return this.handleRefund(event.data.object);
                
                case 'charge.dispute.created':
                    return this.handleDispute(event.data.object);
                
                default:
                    console.log(`Unhandled event type: ${event.type}`);
                    return { status: 'ignored' };
            }
        } catch (err) {
            console.error('Webhook error:', err);
            throw new Error('Webhook handling failed');
        }
    }

    private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.update({
                where: { paymentIntentId: paymentIntent.id },
                data: {
                    status: PaymentStatus.PAID,
                    metadata: paymentIntent
                }
            });

            await tx.order.update({
                where: { id: payment.orderId },
                data: {
                    status: OrderStatus.CONFIRMED,
                    paymentStatus: PaymentStatus.PAID
                }
            });

            return { status: 'success', paymentId: payment.id };
        });
    }

    async createRefund(paymentId: string, amount?: number) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId }
        });

        if (!payment || !payment.paymentIntentId) {
            throw new Error('Payment not found');
        }

        const refund = await this.stripe.refunds.create({
            payment_intent: payment.paymentIntentId,
            amount: amount ? Math.round(amount * 100) : undefined
        });

        await this.prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: PaymentStatus.REFUNDED,
                refundId: refund.id,
                metadata: {
                    ...payment.metadata,
                    refund
                }
            }
        });

        return refund;
    }
}
```

### 3. Payment Service Implementation
```typescript
// services/payment.service.ts
export class PaymentService {
    private prisma: PrismaClient;
    private stripeService: StripeService;
    private emailService: EmailService;

    constructor() {
        this.prisma = new PrismaClient();
        this.stripeService = new StripeService();
        this.emailService = new EmailService();
    }

    async processOrderPayment(orderId: string) {
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: {
                    user: true
                }
            });

            if (!order) throw new Error('Order not found');

            // Create or get Stripe customer
            const stripeCustomerId = await this.ensureStripeCustomer(order.user);

            // Create payment intent
            const paymentIntent = await this.stripeService.createPaymentIntent({
                amount: order.total,
                currency: 'USD',
                customerId: stripeCustomerId,
                paymentMethodId: order.user.defaultPaymentMethodId
            });

            // Create payment record
            const payment = await tx.payment.create({
                data: {
                    orderId: order.id,
                    amount: order.total,
                    status: PaymentStatus.PENDING,
                    paymentIntentId: paymentIntent.id,
                    metadata: paymentIntent
                }
            });

            return {
                paymentId: payment.id,
                clientSecret: paymentIntent.client_secret
            };
        });
    }

    private async ensureStripeCustomer(user: User) {
        if (user.stripeCustomerId) {
            return user.stripeCustomerId;
        }

        const customer = await this.stripeService.createCustomer({
            email: user.email,
            name: user.name,
            metadata: {
                userId: user.id
            }
        });

        await this.prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: customer.id }
        });

        return customer.id;
    }
}
```

### 4. Payment Controller Implementation
```typescript
// controllers/payment.controller.ts
export class PaymentController {
    private paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
    }

    async processPayment(req: Request, res: Response) {
        try {
            const { orderId } = req.body;
            const result = await this.paymentService.processOrderPayment(orderId);
            res.json(result);
        } catch (error) {
            handleError(error, res);
        }
    }

    async handleWebhook(req: Request, res: Response) {
        try {
            const sig = req.headers['stripe-signature'];
            const result = await this.paymentService.handleWebhook(
                sig as string,
                req.body
            );
            res.json(result);
        } catch (error) {
            handleError(error, res);
        }
    }
}
```

## Exercises
1. Implement complete payment flow
2. Set up webhook handling
3. Create refund system
4. Handle payment failures
5. Implement payment method management

## Additional Resources
- [Stripe Documentation](https://stripe.com/docs)
- [Payment Security Best Practices](https://www.pcisecuritystandards.org/)
- [Webhook Implementation Guide](https://stripe.com/docs/webhooks)

## Teaching Notes
- Emphasize security measures
- Cover error handling
- Discuss webhook reliability
- Show testing approaches
- Explain PCI compliance

## Homework
Build a complete payment system:
1. Stripe integration
2. Payment method management
3. Webhook handling
4. Refund processing
5. Payment analytics
6. Security measures
