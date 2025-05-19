# Building the ERD: Mapping Your Digital Store 🏗️

## Lesson Overview

Welcome to the blueprint phase of our e-commerce project! In this lesson, we'll learn how to create an Entity-Relationship Diagram (ERD) - think of it as drawing the blueprint for our digital store 🏗️. This will help us understand how all the pieces of our e-commerce platform will fit together.

## For Instructors

### Lesson Objectives

Students will learn:
- Understand database concepts and relationships
- Create an ERD from user stories
- Identify entities and their relationships
- Plan database structure for scalability

### Teaching Strategy

- Use the "store blueprint" analogy
- Start with simple examples
- Build complexity gradually
- Use visual aids and diagrams

## Part 1: Database Fundamentals - The Store Blueprint 🏗️

### Key Concepts

- Entities: The "rooms" of our store (Users, Products, Orders)
- Relationships: The "hallways" connecting rooms
- Attributes: The "furniture" in each room

### Common Relationships

1. One-to-One (1:1): Like a store manager and their office
2. One-to-Many (1:N): Like a shelf and its products
3. Many-to-Many (M:N): Like customers and orders

## Part 2: Creating Our ERD - The Store Layout 📐

### Core Entities

1. **Users**
   - id
   - name
   - email
   - role (customer/admin)
   - password

2. **Products**
   - id
   - name
   - description
   - price
   - category_id
   - stock_quantity

3. **Orders**
   - id
   - user_id
   - total_amount
   - status
   - created_at

4. **Categories**
   - id
   - name
   - description

5. **Order Items**
   - id
   - order_id
   - product_id
   - quantity
   - price_at_time

## Part 3: Relationship Mapping - The Store Navigation 🧭

### Key Relationships

1. Users to Orders (1:N)
2. Products to Categories (M:N)
3. Orders to Order Items (1:N)
4. Products to Order Items (M:N)

### Real-World Application

- Create a group activity where students design their own ERD
- Use online tools like dbdiagram.io for visualization
- Practice identifying relationships between entities

## Part 4: Best Practices - The Store Design Principles 🏛️

### Key Principles

1. Normalize data to avoid redundancy
2. Use proper data types
3. Consider future scalability
4. Plan for data integrity

### Common Pitfalls to Avoid

- Over-normalization
- Inconsistent relationships
- Missing foreign keys
- Poor naming conventions

## Next Steps

In the next lesson, we'll translate this ERD into a Prisma schema. Get ready to turn our blueprint into a real database structure! 🚀
