# Advanced Features & Optimization

## Learning Objectives
By the end of this lesson, students will be able to:
- Implement caching strategies
- Optimize database queries
- Handle high concurrency
- Monitor application performance
- Scale the application

## Prerequisites
- Complete e-commerce system
- Redis for caching
- Monitoring tools setup

## Lesson Content

### 1. Caching Implementation
```typescript
// services/cache.service.ts
export class CacheService {
    private redis: Redis;
    private defaultTTL: number = 3600; // 1 hour

    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT!),
            password: process.env.REDIS_PASSWORD
        });
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.redis.get(key);
        return data ? JSON.parse(data) : null;
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        await this.redis.set(
            key,
            JSON.stringify(value),
            'EX',
            ttl || this.defaultTTL
        );
    }

    async invalidate(pattern: string): Promise<void> {
        const keys = await this.redis.keys(pattern);
        if (keys.length) {
            await this.redis.del(...keys);
        }
    }
}

// Example usage in ProductService
export class ProductService {
    private cache: CacheService;

    async getProduct(id: number) {
        const cacheKey = `product:${id}`;
        
        // Try cache first
        const cached = await this.cache.get(cacheKey);
        if (cached) return cached;

        // Get from database
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { /* ... */ }
        });

        // Cache the result
        if (product) {
            await this.cache.set(cacheKey, product);
        }

        return product;
    }
}
```

### 2. Query Optimization
```typescript
// services/product.service.ts
export class ProductService {
    async getProductsOptimized(params: ProductSearchParams) {
        // Build efficient query
        const where = this.buildWhereClause(params);
        const include = this.buildIncludeClause(params);

        // Use countBy for efficient counting
        const total = await this.prisma.product.count({ where });

        // Implement cursor-based pagination
        const products = await this.prisma.product.findMany({
            where,
            include,
            take: params.limit,
            skip: params.cursor ? 1 : 0,
            cursor: params.cursor ? { id: params.cursor } : undefined,
            orderBy: [
                { [params.sortBy]: params.sortOrder },
                { id: 'asc' } // Secondary sort for cursor stability
            ]
        });

        return {
            products,
            pagination: {
                total,
                hasMore: products.length === params.limit,
                nextCursor: products[products.length - 1]?.id
            }
        };
    }

    private buildWhereClause(params: ProductSearchParams) {
        // Implement efficient filtering
        return {
            AND: [
                params.search ? {
                    OR: [
                        { name: { contains: params.search, mode: 'insensitive' } },
                        { description: { contains: params.search, mode: 'insensitive' } }
                    ]
                } : {},
                params.categoryId ? {
                    categories: { some: { id: params.categoryId } }
                } : {},
                params.minPrice ? { price: { gte: params.minPrice } } : {},
                params.maxPrice ? { price: { lte: params.maxPrice } } : {}
            ]
        };
    }
}
```

### 3. Concurrency Handling
```typescript
// services/inventory.service.ts
export class InventoryService {
    async updateInventory(productId: number, quantity: number) {
        // Use advisory lock
        const lockKey = `inventory:${productId}`;
        
        return this.prisma.$transaction(async (tx) => {
            // Acquire lock
            await tx.$executeRaw`SELECT pg_advisory_xact_lock(${lockKey})`;

            const product = await tx.product.findUnique({
                where: { id: productId }
            });

            if (!product) throw new Error('Product not found');
            
            if (product.inventory + quantity < 0) {
                throw new Error('Insufficient inventory');
            }

            return tx.product.update({
                where: { id: productId },
                data: {
                    inventory: {
                        increment: quantity
                    }
                }
            });
        });
    }

    async reserveInventory(items: CartItem[]) {
        return this.prisma.$transaction(async (tx) => {
            for (const item of items) {
                const lockKey = `inventory:${item.productId}`;
                await tx.$executeRaw`SELECT pg_advisory_xact_lock(${lockKey})`;

                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                });

                if (!product || product.inventory < item.quantity) {
                    throw new Error(`Insufficient inventory for product ${item.productId}`);
                }

                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        inventory: {
                            decrement: item.quantity
                        }
                    }
                });
            }
        });
    }
}
```

### 4. Performance Monitoring
```typescript
// middleware/performance.middleware.ts
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const duration = seconds * 1000 + nanoseconds / 1000000;

        // Log performance metrics
        logger.info({
            type: 'performance',
            path: req.path,
            method: req.method,
            statusCode: res.statusCode,
            duration,
            timestamp: new Date().toISOString()
        });

        // Send metrics to monitoring service
        metrics.gauge('api.response.time', duration, {
            path: req.path,
            method: req.method,
            status: res.statusCode
        });
    });

    next();
};
```

### 5. Database Indexing
```sql
-- Optimized indexes for common queries
CREATE INDEX idx_products_search ON products 
USING gin(to_tsvector('english', name || ' ' || description));

CREATE INDEX idx_products_category ON products_categories (category_id);
CREATE INDEX idx_products_price ON products (price);
CREATE INDEX idx_orders_user_status ON orders (user_id, status);
CREATE INDEX idx_order_items_product ON order_items (product_id);
```

## Exercises
1. Implement caching system
2. Optimize database queries
3. Handle concurrent operations
4. Set up monitoring
5. Implement performance testing

## Additional Resources
- [Redis Caching Patterns](https://redis.io/topics/patterns)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)
- [Node.js Performance Guide](https://nodejs.org/en/docs/guides/dont-block-the-event-loop)

## Teaching Notes
- Emphasize monitoring importance
- Show performance testing methods
- Discuss scaling strategies
- Cover failure scenarios
- Explain optimization techniques

## Homework
Implement advanced features:
1. Complete caching system
2. Query optimization
3. Concurrency handling
4. Performance monitoring
5. Load testing
6. Scaling strategy
