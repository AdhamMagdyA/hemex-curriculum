**[presentation](https://gamma.app/docs/Building-the-ERD-Mapping-Your-Digital-Store-cjgn29m2e9ag9l2)**

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

- Entities: The "rooms" of our store (Users, Products, Orders).
- Tables: Represent entities or might represent a relationship (like M:M). tables are called relations as well
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
#### example relationships to practice
 1. student and calss: 1:M
 2. student and subject: M:M
 3. student and teacher: 1:M
 4. teacher and subject: 1:M or maybe M:M
 
## Part 4: Best Practices - The Store Design Principles 🏛️

### Key Principles

1. **Normalize data to avoid redundancy**:
	* Use First Normal Form (1NF) to avoid repeating values
	* Use Second Normal Form (2NF) to avoid partial dependency
	* Use Third Normal Form (3NF) to avoid transitive dependency

### Normalization Examples:

#### 1. First Normal Form (1NF)
**Rule**: Each table cell should contain a single value, and each record needs to be unique.

**Example - Before 1NF (Violation)**:
```
Orders Table:
| OrderID | Customer  | Products                     |
|---------|-----------|------------------------------|
| 1       | John Doe  | Laptop, Mouse, Keyboard      |
| 2       | Jane Smith| Monitor, Headphones, Keyboard|
```
**Problem**: The Products column contains multiple values in a single cell.

**After 1NF**:
```
OrderItems Table:
| OrderID | Product   |
|---------|-----------|
| 1       | Laptop    |
| 1       | Mouse     |
| 1       | Keyboard  |
| 2       | Monitor   |
| 2       | Headphones|
| 2       | Keyboard  |
```

#### 2. Second Normal Form (2NF)
**Rule**: Table must be in 1NF and all non-key attributes must depend on the entire primary key (no partial dependency).

**Example - Before 2NF (Violation)**:
```
OrderDetails Table:
| OrderID | ProductID | ProductName | Price | Quantity | OrderDate  |
|---------|-----------|-------------|-------|----------|------------|
| 1       | 101       | Laptop      | 999   | 1        | 2025-05-26 |
| 1       | 102       | Mouse       | 25    | 2        | 2025-05-26 |
```
**Problem**: `ProductName` and `Price` depend only on `ProductID`, not on the full primary key (OrderID+ProductID).

**After 2NF**:
```
Orders Table:
| OrderID | OrderDate  |
|---------|------------|
| 1       | 2025-05-26 |

OrderItems Table:
| OrderID | ProductID | Quantity |
|---------|-----------|----------|
| 1       | 101       | 1        |
| 1       | 102       | 2        |

Products Table:
| ProductID | ProductName | Price |
|-----------|-------------|-------|
| 101       | Laptop      | 999   |
| 102       | Mouse       | 25    |
```

#### 3. Third Normal Form (3NF)
**Rule**: Table must be in 2NF and there should be no transitive dependency (non-key attributes shouldn't depend on other non-key attributes).

**Example - Before 3NF (Violation)**:
```
Customers Table:
| CustomerID | Name      | Email              | City      | Country   | ShippingZone |
|------------|-----------|-------------------|-----------|-----------|--------------|
| 1          | John Doe  | john@example.com  | New York  | USA       | East         |
| 2          | Jane Smith| jane@example.com  | London    | UK        | Europe       |
```
**Problem**: `ShippingZone` depends on `Country`, not directly on `CustomerID`.

**After 3NF**:
```
Customers Table:
| CustomerID | Name      | Email              | City      | Country   |
|------------|-----------|-------------------|-----------|-----------|
| 1          | John Doe  | john@example.com  | New York  | USA       |
| 2          | Jane Smith| jane@example.com  | London    | UK        |

ShippingZones Table:
| Country   | ShippingZone |
|-----------|--------------|
| USA       | East         |
| UK        | Europe       |
```

**Key Benefits**:
- **1NF**: Eliminates repeating groups and ensures atomic values
- **2NF**: Removes partial dependencies, reducing data redundancy
- **3NF**: Removes transitive dependencies, ensuring non-key attributes depend only on the primary key
2. **Use proper data types**:
	* Understand when to use `int`, `float`, `string`, `bool`, `datetime`, `array`, `enum`
	* Consider the range of values and precision required
	* Consider the impact on performance and storage
3. **Consider future scalability**:
	* Anticipate potential growth in data volume
	* Plan for potential changes in schema
	* Plan for potential horizontal scaling
4. **Plan for data integrity**:
	* Use primary keys to ensure data consistency
	* Use foreign keys to ensure referential integrity
	* Use constraints to enforce data consistency

### Common Pitfalls to Avoid

1. **Over-normalization**:
	* Avoid splitting data into too many tables
	* Avoid creating unnecessary tables
	* Avoid creating tables with too many columns
2. **Inconsistent relationships**:
	* Avoid inconsistent relationships between entities
	* Use a consistent naming convention for tables and columns
	* Use a consistent relationship type (1:1, 1:N, M:N)
3. **Missing foreign keys**:
	* Use foreign keys to establish referential integrity
	* Use indexes to improve performance
	* Use constraints to enforce data consistency
4. **Poor naming conventions**:
	* Use a consistent naming convention for tables and columns
	* Avoid using abbreviations or acronyms
	* Use descriptive names that indicate the purpose of the table or column

## Next Steps

In the next lesson, we'll translate this ERD into a Prisma schema. Get ready to turn our blueprint into a real database structure! 🚀
