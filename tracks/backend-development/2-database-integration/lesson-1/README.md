# Introduction to ORMs

## Learning Objectives
By the end of this lesson, students will be able to:
- Understand what an ORM is and its benefits
- Compare ORMs with raw SQL queries
- Know when to use an ORM vs raw queries
- Understand Prisma's advantages

## Prerequisites
- Basic SQL knowledge
- Node.js fundamentals
- Understanding of database concepts

## Lesson Content

### 1. What is an ORM?
Object-Relational Mapping (ORM) is a technique that lets you query and manipulate data from a database using an object-oriented paradigm.

#### Benefits of using an ORM:
- Type safety
- Automatic query generation
- Database agnostic code
- Reduced boilerplate
- Better security (SQL injection prevention)

### 2. ORM vs Raw SQL

#### Raw SQL Example:
```sql
SELECT * FROM users 
WHERE email = 'john@example.com' 
AND active = true;
```

#### Prisma ORM Example:
```typescript
const user = await prisma.user.findFirst({
  where: {
    email: 'john@example.com',
    active: true
  }
});
```

### 3. Popular Node.js ORMs
1. Prisma
   - Type-safe
   - Modern and intuitive
   - Great documentation
   - Schema-first approach

2. Sequelize
   - Mature and battle-tested
   - Supports multiple databases
   - Large community

3. TypeORM
   - TypeScript support
   - Decorator-based
   - Active Record pattern

### 4. When to Use an ORM
#### Good Use Cases:
- CRUD operations
- Standard queries
- Rapid development
- Type safety requirements

#### When to Consider Raw SQL:
- Complex queries
- Performance-critical operations
- Custom database features
- Specific optimization needs

## Exercises
1. Compare the same query in raw SQL vs different ORMs
2. List pros and cons of using an ORM for a specific project
3. Design a simple database schema
4. Practice converting between SQL and ORM queries

## Additional Resources
- [Prisma Documentation](https://www.prisma.io/docs/)
- [SQL vs ORM blog post](https://www.prisma.io/dataguide/types/relational/comparing-sql-query-builders-and-orms)
- [Database Design Fundamentals](https://www.postgresql.org/docs/current/tutorial-design.html)

## Teaching Notes
- Use real-world examples to demonstrate ORM benefits
- Show performance implications
- Discuss common pitfalls
- Demonstrate debugging techniques
- Compare different ORMs

## Common Questions
1. "When should I not use an ORM?"
2. "What about performance overhead?"
3. "How do ORMs handle migrations?"
4. "Can I mix raw SQL with ORM queries?"

## Homework
Design a database schema for a library management system:
- Books, Authors, Members, Loans
- Write both SQL and ORM queries
- Compare approaches
- Document pros and cons of each method
