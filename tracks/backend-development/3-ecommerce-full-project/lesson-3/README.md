# Building the Prisma Schema: The Digital Blueprint 🏗️

## Lesson Overview

Welcome to the database setup phase! In this lesson, we'll transform our ERD into a Prisma schema - think of it as creating the digital blueprint for our e-commerce platform. We'll learn how to set up our database and define our data models.

## For Instructors

### Lesson Objectives

Students will learn:
- Install and configure Prisma
- Define database models
- Create relationships between models
- Perform database migrations

### Teaching Strategy

- Use the "digital blueprint" analogy
- Start with simple models
- Build complexity gradually
- Use practical examples

## Part 1: Setting Up Prisma - The Blueprint Tools 🛠️

### Key Steps

1. Install Prisma:
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

2. Configure Database:
   - Edit `.env` file
   - Set up database connection
   - Test connection

## Part 2: Creating Models - The Blueprint Rooms 🏠

### Core Models

1. **User Model**
   ```prisma
   model User {
     id            Int      @id @default(autoincrement())
     name          String
     email         String   @unique
     password      String
     role          Role     @default(CUSTOMER)
     createdAt     DateTime @default(now())
     updatedAt     DateTime @updatedAt
     orders        Order[]
     products      Product[]
   }
   ```

2. **Product Model**
   ```prisma
   model Product {
     id            Int      @id @default(autoincrement())
     name          String
     description   String
     price         Decimal
     stock         Int
     category      Category @relation(fields: [categoryId], references: [id])
     categoryId    Int
     createdAt     DateTime @default(now())
     updatedAt     DateTime @updatedAt
   }
   ```

## Part 3: Relationships - The Blueprint Connections 🔄

### Key Relationships

1. One-to-Many:
   - User to Orders
   - Category to Products

2. Many-to-Many:
   - Users to Products (through Cart)
   - Users to Orders

## Part 4: Migrations - Building the Foundation 🏗️

### Key Commands

1. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

2. Create Migration:
   ```bash
   npx prisma migrate dev --name init
   ```

3. Apply to Production:
   ```bash
   npx prisma migrate deploy
   ```

### Best Practices

- Always run `prisma generate` after schema changes
- Use descriptive migration names
- Test migrations before production
- Keep schema.prisma clean and organized

## Real-World Application

- Create a group activity where students design their own models
- Practice creating relationships between entities
- Use Prisma Studio to visualize the database
- Test CRUD operations

## Next Steps

In the next lesson, we'll dive into building authentication and user management. Get ready to secure our digital store! 🔐
