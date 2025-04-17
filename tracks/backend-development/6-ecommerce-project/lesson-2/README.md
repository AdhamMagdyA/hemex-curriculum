# Product & Category Management

## Learning Objectives
By the end of this lesson, students will be able to:
- Implement complete product management system
- Handle product variations and inventory
- Manage categories with hierarchical structure
- Handle image uploads and processing
- Implement search and filtering

## Prerequisites
- Project setup from Lesson 1
- AWS S3 account for image storage
- Redis for caching (optional)

## Lesson Content

### 1. Enhanced Product Schema
```prisma
// schema.prisma
model Product {
    id          Int       @id @default(autoincrement())
    name        String
    slug        String    @unique
    description String?   @db.Text
    price       Decimal   @db.Decimal(10, 2)
    comparePrice Decimal? @db.Decimal(10, 2)
    sku         String    @unique
    barcode     String?   @unique
    inventory   Int       @default(0)
    isVisible   Boolean   @default(true)
    categories  Category[]
    variations  ProductVariation[]
    images      ProductImage[]
    orderItems  OrderItem[]
    reviews     Review[]
    tags        Tag[]
    metadata    Json?
    createdAt   DateTime  @default(now())
    updatedAt   DateTime  @updatedAt

    @@index([slug])
    @@index([isVisible])
}

model ProductVariation {
    id        Int      @id @default(autoincrement())
    product   Product  @relation(fields: [productId], references: [id])
    productId Int
    sku       String   @unique
    barcode   String?  @unique
    name      String
    price     Decimal  @db.Decimal(10, 2)
    inventory Int      @default(0)
    options   Json     // {size: "XL", color: "Red", etc.}
    isVisible Boolean  @default(true)
    
    @@index([productId])
}

model Category {
    id          Int       @id @default(autoincrement())
    name        String
    slug        String    @unique
    description String?   @db.Text
    image       String?
    products    Product[]
    parent      Category?  @relation("SubCategories", fields: [parentId], references: [id])
    parentId    Int?
    children    Category[] @relation("SubCategories")
    isVisible   Boolean    @default(true)
    order       Int        @default(0)
    
    @@index([slug])
    @@index([parentId])
}
```

### 2. Product Service Implementation
```typescript
// services/product.service.ts
import { PrismaClient, Prisma } from '@prisma/client';
import { S3Service } from './s3.service';
import { RedisService } from './redis.service';
import { ProductDTO, ProductSearchParams } from '../types';

export class ProductService {
    private prisma: PrismaClient;
    private s3Service: S3Service;
    private redisService: RedisService;

    constructor() {
        this.prisma = new PrismaClient();
        this.s3Service = new S3Service();
        this.redisService = new RedisService();
    }

    async createProduct(data: ProductDTO) {
        const { images, variations, categoryIds, ...productData } = data;

        // Generate slug
        const slug = await this.generateUniqueSlug(productData.name);

        return this.prisma.$transaction(async (tx) => {
            // Create product
            const product = await tx.product.create({
                data: {
                    ...productData,
                    slug,
                    categories: {
                        connect: categoryIds.map(id => ({ id }))
                    }
                }
            });

            // Handle variations if any
            if (variations?.length) {
                await tx.productVariation.createMany({
                    data: variations.map(v => ({
                        ...v,
                        productId: product.id
                    }))
                });
            }

            // Handle images
            if (images?.length) {
                const uploadPromises = images.map(image => 
                    this.s3Service.uploadImage(image.buffer, {
                        prefix: `products/${product.id}`
                    })
                );

                const uploadedUrls = await Promise.all(uploadPromises);

                await tx.productImage.createMany({
                    data: uploadedUrls.map((url, index) => ({
                        productId: product.id,
                        url,
                        alt: images[index].alt,
                        order: index
                    }))
                });
            }

            // Invalidate cache
            await this.redisService.deletePattern(`product:*`);

            return this.getProductById(product.id);
        });
    }

    async searchProducts(params: ProductSearchParams) {
        const {
            query,
            categoryId,
            minPrice,
            maxPrice,
            tags,
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = params;

        // Try cache first
        const cacheKey = `products:search:${JSON.stringify(params)}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) return JSON.parse(cached);

        const where: Prisma.ProductWhereInput = {
            isVisible: true,
            AND: [
                query ? {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } }
                    ]
                } : {},
                categoryId ? {
                    categories: { some: { id: categoryId } }
                } : {},
                minPrice ? { price: { gte: minPrice } } : {},
                maxPrice ? { price: { lte: maxPrice } } : {},
                tags?.length ? {
                    tags: { some: { name: { in: tags } } }
                } : {}
            ]
        };

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    categories: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    },
                    images: {
                        orderBy: { order: 'asc' }
                    },
                    variations: {
                        where: { isVisible: true }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { [sortBy]: sortOrder }
            }),
            this.prisma.product.count({ where })
        ]);

        const result = {
            products,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        };

        // Cache results
        await this.redisService.set(cacheKey, JSON.stringify(result), 300); // 5 minutes

        return result;
    }

    private async generateUniqueSlug(name: string): Promise<string> {
        let slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const existing = await this.prisma.product.findFirst({
            where: { slug }
        });

        if (!existing) return slug;

        let count = 1;
        let newSlug = `${slug}-${count}`;

        while (await this.prisma.product.findFirst({
            where: { slug: newSlug }
        })) {
            count++;
            newSlug = `${slug}-${count}`;
        }

        return newSlug;
    }
}
```

### 3. Category Service
```typescript
// services/category.service.ts
export class CategoryService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getCategoryTree() {
        const categories = await this.prisma.category.findMany({
            where: { parentId: null, isVisible: true },
            include: {
                children: {
                    where: { isVisible: true },
                    include: {
                        children: {
                            where: { isVisible: true }
                        }
                    }
                }
            },
            orderBy: { order: 'asc' }
        });

        return this.processCategoryTree(categories);
    }

    private processCategoryTree(categories: Category[]) {
        return categories.map(category => ({
            ...category,
            path: this.buildCategoryPath(category),
            children: category.children ? 
                this.processCategoryTree(category.children) : []
        }));
    }

    private buildCategoryPath(category: Category): string {
        const parts = [category.slug];
        let parent = category.parent;
        
        while (parent) {
            parts.unshift(parent.slug);
            parent = parent.parent;
        }

        return parts.join('/');
    }
}
```

### 4. Product Controllers
```typescript
// controllers/product.controller.ts
export class ProductController {
    private productService: ProductService;
    
    constructor() {
        this.productService = new ProductService();
    }

    async createProduct(req: Request, res: Response) {
        try {
            const product = await this.productService.createProduct({
                ...req.body,
                images: req.files
            });
            
            res.status(201).json(product);
        } catch (error) {
            handleError(error, res);
        }
    }

    async searchProducts(req: Request, res: Response) {
        try {
            const products = await this.productService.searchProducts(req.query);
            res.json(products);
        } catch (error) {
            handleError(error, res);
        }
    }

    // More controller methods...
}
```

## Exercises
1. Implement complete product CRUD with variations
2. Create category management system
3. Add image upload with resizing
4. Implement caching strategy
5. Create search API with filters

## Additional Resources
- [Image Processing with Sharp](https://sharp.pixelplumbing.com/)
- [Redis Caching Patterns](https://redis.io/topics/patterns)
- [Database Indexing Strategies](https://www.postgresql.org/docs/current/indexes-types.html)

## Teaching Notes
- Emphasize proper error handling
- Cover transaction usage
- Discuss caching strategies
- Show performance optimization
- Explain search implementation

## Homework
Build a complete product management system:
1. Full CRUD for products and categories
2. Image upload and processing
3. Search and filtering
4. Caching implementation
5. API documentation
6. Performance testing
