# Cart & Order Management

## Learning Objectives
By the end of this lesson, students will be able to:
- Implement a shopping cart system
- Create order management flow
- Handle inventory updates
- Manage order statuses
- Implement order notifications

## Prerequisites
- Product management system
- Redis for cart storage
- Email service setup

## Lesson Content

### 1. Cart & Order Schema
```prisma
// schema.prisma
model Cart {
    id          String    @id @default(uuid())
    userId      Int?
    user        User?     @relation(fields: [userId], references: [id])
    items       CartItem[]
    createdAt   DateTime  @default(now())
    updatedAt   DateTime  @updatedAt
    expiresAt   DateTime?

    @@index([userId])
}

model CartItem {
    id            Int      @id @default(autoincrement())
    cart          Cart     @relation(fields: [cartId], references: [id])
    cartId        String
    product       Product  @relation(fields: [productId], references: [id])
    productId     Int
    variation     ProductVariation? @relation(fields: [variationId], references: [id])
    variationId   Int?
    quantity      Int
    price         Decimal  @db.Decimal(10, 2)
    
    @@unique([cartId, productId, variationId])
}

model Order {
    id            String    @id @default(uuid())
    user          User      @relation(fields: [userId], references: [id])
    userId        Int
    status        OrderStatus
    items         OrderItem[]
    subtotal      Decimal   @db.Decimal(10, 2)
    tax          Decimal   @db.Decimal(10, 2)
    shipping     Decimal   @db.Decimal(10, 2)
    total        Decimal   @db.Decimal(10, 2)
    shippingAddress Address @relation("ShippingAddress", fields: [shippingAddressId], references: [id])
    shippingAddressId Int
    billingAddress  Address @relation("BillingAddress", fields: [billingAddressId], references: [id])
    billingAddressId Int
    paymentIntent   String?
    paymentStatus   PaymentStatus @default(PENDING)
    notes          String?
    createdAt     DateTime @default(now())
    updatedAt     DateTime @updatedAt

    @@index([userId])
    @@index([status])
}

model OrderItem {
    id          Int      @id @default(autoincrement())
    order       Order    @relation(fields: [orderId], references: [id])
    orderId     String
    product     Product  @relation(fields: [productId], references: [id])
    productId   Int
    variation   ProductVariation? @relation(fields: [variationId], references: [id])
    variationId Int?
    quantity    Int
    price       Decimal  @db.Decimal(10, 2)
    
    @@index([orderId])
}

model Address {
    id          Int      @id @default(autoincrement())
    user        User     @relation(fields: [userId], references: [id])
    userId      Int
    type        AddressType
    firstName   String
    lastName    String
    company     String?
    address1    String
    address2    String?
    city        String
    state       String
    postalCode  String
    country     String
    phone       String?
    isDefault   Boolean  @default(false)
    shippingOrders Order[] @relation("ShippingAddress")
    billingOrders  Order[] @relation("BillingAddress")

    @@index([userId])
}

enum OrderStatus {
    PENDING
    CONFIRMED
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELLED
    REFUNDED
}

enum PaymentStatus {
    PENDING
    PAID
    FAILED
    REFUNDED
}

enum AddressType {
    SHIPPING
    BILLING
    BOTH
}
```

### 2. Cart Service Implementation
```typescript
// services/cart.service.ts
export class CartService {
    private prisma: PrismaClient;
    private redis: Redis;

    constructor() {
        this.prisma = new PrismaClient();
        this.redis = new Redis();
    }

    async getOrCreateCart(userId?: number): Promise<Cart> {
        if (userId) {
            const existingCart = await this.prisma.cart.findFirst({
                where: {
                    userId,
                    expiresAt: {
                        gt: new Date()
                    }
                },
                include: {
                    items: {
                        include: {
                            product: true,
                            variation: true
                        }
                    }
                }
            });

            if (existingCart) return existingCart;
        }

        return this.prisma.cart.create({
            data: {
                userId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        });
    }

    async addToCart(cartId: string, data: AddToCartDTO) {
        const { productId, variationId, quantity } = data;

        return this.prisma.$transaction(async (tx) => {
            // Check product availability
            const product = await tx.product.findUnique({
                where: { id: productId },
                include: {
                    variations: variationId ? {
                        where: { id: variationId }
                    } : false
                }
            });

            if (!product) throw new Error('Product not found');

            const targetItem = variationId ? 
                product.variations[0] : product;

            if (!targetItem || targetItem.inventory < quantity) {
                throw new Error('Insufficient inventory');
            }

            // Add or update cart item
            const cartItem = await tx.cartItem.upsert({
                where: {
                    cartId_productId_variationId: {
                        cartId,
                        productId,
                        variationId: variationId || null
                    }
                },
                update: {
                    quantity: {
                        increment: quantity
                    }
                },
                create: {
                    cartId,
                    productId,
                    variationId,
                    quantity,
                    price: targetItem.price
                }
            });

            return cartItem;
        });
    }

    async updateCartItemQuantity(
        cartId: string,
        itemId: number,
        quantity: number
    ) {
        if (quantity <= 0) {
            return this.removeCartItem(cartId, itemId);
        }

        return this.prisma.$transaction(async (tx) => {
            const item = await tx.cartItem.findUnique({
                where: { id: itemId },
                include: {
                    product: true,
                    variation: true
                }
            });

            if (!item || item.cartId !== cartId) {
                throw new Error('Cart item not found');
            }

            const targetItem = item.variation || item.product;
            if (targetItem.inventory < quantity) {
                throw new Error('Insufficient inventory');
            }

            return tx.cartItem.update({
                where: { id: itemId },
                data: { quantity }
            });
        });
    }
}
```

### 3. Order Service Implementation
```typescript
// services/order.service.ts
export class OrderService {
    private prisma: PrismaClient;
    private emailService: EmailService;

    constructor() {
        this.prisma = new PrismaClient();
        this.emailService = new EmailService();
    }

    async createOrder(userId: number, data: CreateOrderDTO) {
        const { cartId, shippingAddressId, billingAddressId, notes } = data;

        return this.prisma.$transaction(async (tx) => {
            // Get cart with items
            const cart = await tx.cart.findUnique({
                where: { id: cartId },
                include: {
                    items: {
                        include: {
                            product: true,
                            variation: true
                        }
                    }
                }
            });

            if (!cart || cart.userId !== userId) {
                throw new Error('Cart not found');
            }

            // Calculate totals
            const { subtotal, tax, shipping, total } = await this.calculateOrderTotals(cart.items);

            // Create order
            const order = await tx.order.create({
                data: {
                    userId,
                    status: OrderStatus.PENDING,
                    shippingAddressId,
                    billingAddressId,
                    subtotal,
                    tax,
                    shipping,
                    total,
                    notes,
                    items: {
                        create: cart.items.map(item => ({
                            productId: item.productId,
                            variationId: item.variationId,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                },
                include: {
                    items: {
                        include: {
                            product: true,
                            variation: true
                        }
                    },
                    shippingAddress: true,
                    billingAddress: true
                }
            });

            // Update inventory
            for (const item of cart.items) {
                const targetItem = item.variation || item.product;
                await tx.product.update({
                    where: { id: targetItem.id },
                    data: {
                        inventory: {
                            decrement: item.quantity
                        }
                    }
                });
            }

            // Delete cart
            await tx.cart.delete({
                where: { id: cartId }
            });

            // Send order confirmation email
            await this.emailService.sendOrderConfirmation(order);

            return order;
        });
    }

    private async calculateOrderTotals(items: CartItem[]) {
        const subtotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const tax = subtotal * 0.15; // 15% tax
        const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100

        return {
            subtotal,
            tax,
            shipping,
            total: subtotal + tax + shipping
        };
    }

    async updateOrderStatus(orderId: string, status: OrderStatus) {
        const order = await this.prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: {
                user: true,
                items: true
            }
        });

        // Send status update email
        await this.emailService.sendOrderStatusUpdate(order);

        return order;
    }
}
```

## Exercises
1. Implement complete cart functionality
2. Create order processing flow
3. Add inventory management
4. Implement order notifications
5. Create order tracking system

## Additional Resources
- [Redis Cart Implementation](https://redis.io/topics/data-types-intro)
- [Order Management Best Practices](https://www.shopify.com/enterprise/order-management-system)
- [Email Templates with MJML](https://mjml.io/)

## Teaching Notes
- Emphasize transaction usage
- Cover inventory race conditions
- Discuss email notification strategies
- Show order status workflows
- Explain cart expiration handling

## Homework
Build a complete order management system:
1. Shopping cart implementation
2. Order processing workflow
3. Inventory management
4. Email notifications
5. Order tracking
6. Admin dashboard for orders
