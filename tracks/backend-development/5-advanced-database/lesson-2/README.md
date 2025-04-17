# Advanced ORM Relationships

## Learning Objectives
By the end of this lesson, students will be able to:
- Implement different types of relationships (1:1, 1:M, M:N)
- Use query builders for complex queries
- Optimize relationship queries
- Handle circular dependencies

## Prerequisites
- Basic Prisma knowledge
- Database design principles
- SQL fundamentals

## Lesson Content

### 1. Types of Relationships
```prisma
// schema.prisma

// One-to-One Relationship
model User {
    id       Int      @id @default(autoincrement())
    profile  Profile?
}

model Profile {
    id       Int      @id @default(autoincrement())
    user     User     @relation(fields: [userId], references: [id])
    userId   Int      @unique
}

// One-to-Many Relationship
model Author {
    id       Int      @id @default(autoincrement())
    name     String
    posts    Post[]
}

model Post {
    id       Int      @id @default(autoincrement())
    title    String
    author   Author   @relation(fields: [authorId], references: [id])
    authorId Int
}

// Many-to-Many Relationship
model Category {
    id       Int       @id @default(autoincrement())
    name     String
    products Product[]
}

model Product {
    id         Int        @id @default(autoincrement())
    name       String
    categories Category[]
}
```

### 2. Working with Relationships
```javascript
// services/post.service.js
class PostService {
    // Create post with author
    static async createPost(authorId, postData) {
        return prisma.post.create({
            data: {
                ...postData,
                author: {
                    connect: { id: authorId }
                }
            },
            include: {
                author: true
            }
        });
    }

    // Get posts with author
    static async getPostsWithAuthor() {
        return prisma.post.findMany({
            include: {
                author: true
            }
        });
    }

    // Update post categories
    static async updatePostCategories(postId, categoryIds) {
        return prisma.post.update({
            where: { id: postId },
            data: {
                categories: {
                    set: categoryIds.map(id => ({ id }))
                }
            },
            include: {
                categories: true
            }
        });
    }
}
```

### 3. Complex Queries with Query Builder
```javascript
// Using Prisma's query builder for complex queries
const getPostStats = async () => {
    const stats = await prisma.$queryRaw`
        SELECT 
            a.name as author_name,
            COUNT(p.id) as post_count,
            AVG(p.likes) as avg_likes
        FROM Author a
        LEFT JOIN Post p ON a.id = p.authorId
        GROUP BY a.id, a.name
        HAVING COUNT(p.id) > 5
        ORDER BY avg_likes DESC
    `;
    return stats;
};

// Nested queries with relationships
const getAuthorWithDetails = async (authorId) => {
    return prisma.author.findUnique({
        where: { id: authorId },
        include: {
            posts: {
                include: {
                    categories: true,
                    comments: {
                        include: {
                            user: true
                        }
                    }
                }
            },
            followers: true,
            profile: true
        }
    });
};
```

### 4. Query Optimization
```javascript
// Selecting specific fields
const getPostPreviews = async () => {
    return prisma.post.findMany({
        select: {
            id: true,
            title: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });
};

// Pagination with cursor
const getPaginatedPosts = async (cursor, take = 10) => {
    return prisma.post.findMany({
        take,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            author: {
                select: {
                    name: true
                }
            }
        }
    });
};
```

## Exercises
1. Implement all relationship types
2. Create complex nested queries
3. Optimize query performance
4. Handle circular references

## Additional Resources
- [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [Query Optimization](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Raw Database Access](https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access)

## Teaching Notes
- Explain relationship types with diagrams
- Show query performance analysis
- Demonstrate common pitfalls
- Cover N+1 query problem
- Discuss caching strategies

## Common Issues & Solutions
1. N+1 query problem
2. Circular dependencies
3. Over-fetching data
4. Query performance
5. Relationship constraints

## Homework
Build a blog system with:
- Authors and posts (1:M)
- Post categories (M:N)
- User profiles (1:1)
- Comments system
- Tag system
- Performance optimization
- Query analysis
