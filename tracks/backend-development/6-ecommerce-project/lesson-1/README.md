# E-commerce Project: Setup & Product Management

## Learning Objectives
By the end of this lesson, students will be able to:
- Set up an e-commerce project structure
- Implement product and category management
- Handle product variations and inventory
- Create admin APIs for product management

## Prerequisites
- All previous levels completed
- Stripe account for payments
- PostgreSQL database

## Lesson Content

### 1. Project Schema
```prisma
// schema.prisma
model Product {
    id          Int       @id @default(autoincrement())
    name        String
    description String?
    price       Decimal
    sku         String    @unique
    inventory   Int       @default(0)
    categories  Category[]
    variations  ProductVariation[]
    images      ProductImage[]
    orderItems  OrderItem[]
    createdAt   DateTime  @default(now())
    updatedAt   DateTime  @updatedAt
}

model Category {
    id          Int       @id @default(autoincrement())
    name        String
    slug        String    @unique
    description String?
    products    Product[]
    parent      Category?  @relation("SubCategories", fields: [parentId], references: [id])
    parentId    Int?
    children    Category[] @relation("SubCategories")
}

model ProductVariation {
    id        Int      @id @default(autoincrement())
    product   Product  @relation(fields: [productId], references: [id])
    productId Int
    sku       String   @unique
    name      String
    price     Decimal?
    inventory Int      @default(0)
    options   Json     // Store variation options (size, color, etc.)
}

model ProductImage {
    id        Int      @id @default(autoincrement())
    product   Product  @relation(fields: [productId], references: [id])
    productId Int
    url       String
    alt       String?
    order     Int      @default(0)
}
```

### 2. Product Management Service
```javascript
// services/product.service.js
class ProductService {
    static async createProduct(data) {
        const {
            name,
            description,
            price,
            sku,
            inventory,
            categoryIds,
            variations,
            images
        } = data;

        return prisma.product.create({
            data: {
                name,
                description,
                price,
                sku,
                inventory,
                categories: {
                    connect: categoryIds.map(id => ({ id }))
                },
                variations: {
                    create: variations
                },
                images: {
                    create: images
                }
            },
            include: {
                categories: true,
                variations: true,
                images: true
            }
        });
    }

    static async updateInventory(productId, quantity) {
        return prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({
                where: { id: productId }
            });

            if (!product) {
                throw new Error('Product not found');
            }

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

    static async searchProducts(params) {
        const {
            query,
            categoryId,
            minPrice,
            maxPrice,
            page = 1,
            limit = 10
        } = params;

        const where = {
            AND: [
                query ? {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } }
                    ]
                } : {},
                categoryId ? {
                    categories: {
                        some: { id: categoryId }
                    }
                } : {},
                minPrice ? { price: { gte: minPrice } } : {},
                maxPrice ? { price: { lte: maxPrice } } : {}
            ]
        };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    categories: true,
                    images: {
                        orderBy: { order: 'asc' }
                    }
                },
                skip: (page - 1) * limit,
                take: limit
            }),
            prisma.product.count({ where })
        ]);

        return {
            products,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        };
    }
}
```

### 3. Category Management
```javascript
// services/category.service.js
class CategoryService {
    static async createCategory(data) {
        const { name, slug, description, parentId } = data;

        return prisma.category.create({
            data: {
                name,
                slug,
                description,
                parent: parentId ? {
                    connect: { id: parentId }
                } : undefined
            },
            include: {
                parent: true,
                children: true
            }
        });
    }

    static async getCategoryTree() {
        // Get all root categories (no parent)
        const rootCategories = await prisma.category.findMany({
            where: {
                parentId: null
            },
            include: {
                children: {
                    include: {
                        children: true
                    }
                }
            }
        });

        return rootCategories;
    }
}
```

### 4. Image Upload Handler
```javascript
// utils/imageUpload.js
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: process.env.AWS_REGION
});

const uploadToS3 = async (file) => {
    const key = `products/${Date.now()}-${file.originalname}`;

    await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    }));

    return `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${key}`;
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only images are allowed'));
        }
        cb(null, true);
    }
});

module.exports = { upload, uploadToS3 };
```

## Exercises
1. Implement complete product CRUD
2. Create category management system
3. Add image upload functionality
4. Implement product search and filtering

## Additional Resources
- [Stripe API Documentation](https://stripe.com/docs/api)
- [AWS S3 Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
- [Multer Documentation](https://github.com/expressjs/multer)

## Teaching Notes
- Emphasize data validation
- Cover inventory management
- Discuss image handling
- Show category tree implementation
- Cover SEO considerations

## Common Issues & Solutions
1. Image upload errors
2. Inventory race conditions
3. Category tree complexity
4. Search performance
5. Variation management

## Homework
Implement a product management system with:
- Complete CRUD operations
- Image upload to S3
- Category management
- Product variations
- Inventory tracking
- Search functionality
- Admin dashboard API
