# From Memory to Database: Upgrading Our Todo App! 🔄

## Lesson Overview

Welcome to an exciting upgrade of our Todo app! Today, we'll learn how to make our todos permanent by storing them in a magical storage called a database. We'll start with basic SQL (like writing in a special notebook 📔) and then learn about ORMs (like having a smart assistant help us write! 🤖).

## For Instructors

### Lesson Objectives

Students will learn:
- Review and apply SQL fundamentals
- Understand and implement ORM concepts
- Enhance the todo app with database storage
- Implement proper error handling

### Teaching Strategy

- Use the "magical notebook" analogy for databases
- Compare ORM to a smart translator
- Build upon the familiar todo app
- Focus on practical, hands-on examples

## Part 1: SQL Review - Our Magical Notebook 📔

### What is SQL Again?

Think of SQL like a magical language to talk to our notebook (database):
- SELECT = Reading pages 👀
- INSERT = Writing new notes ✍️
- UPDATE = Fixing mistakes ✏️
- DELETE = Erasing notes 🗑️

### Creating Our Todo Database

```sql
-- Create our magical notebook
CREATE DATABASE todo_app;

-- Create a special page for todos
CREATE TABLE todos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Write some sample todos
INSERT INTO todos (task) VALUES 
    ('Feed the dragon 🐲'),
    ('Practice magic spells ✨');

-- Read our todos
SELECT * FROM todos;
```

### Fun Activity: "Database Detective" 🔍 (optional)
1. Give students a list of tasks
2. Have them write SQL queries to:
   - Find all completed tasks
   - Find tasks created today
   - Count total tasks

## Part 2: Introducing ORM - Our Smart Translator 🤖

### What is ORM?

Imagine having a smart robot that:
- Speaks both JavaScript AND SQL
- Translates our code into database language
- Helps prevent mistakes
- Makes working with data easier

Think of it like this:
```javascript
// Without ORM (speaking SQL directly)
db.query('SELECT * FROM todos WHERE completed = true');

// With ORM (speaking JavaScript)
Todo.findAll({ where: { completed: true } });
// The ORM translates this to SQL for us! 🎯
```

### Setting Up Prisma

```bash
npm install prisma @prisma/client
```
create file `prisma/schema.prisma`

run the following command to create the database and your first migration

```bash
npx prisma migrate dev --name init
```

Prisma Client setup

### Upgrading Our Todo App

Project in resources
- build the project step by step with student
- explain the clean structure of the application
- play around with the prisma schema

## Exercises

### 1. Database Explorer
Create these SQL queries:
1. Find all incomplete todos
2. Find todos created in the last week
3. Count todos by completion status

### 2. ORM Magic
1. Add a priority field (HIGH, MEDIUM, LOW)
2. Create a search function
3. Add sorting options

### 3. Error Handler Enhancement
1. Add specific handling for different database errors
2. Create friendly error messages
3. Add error logging

## Coming Next: Relations! 🤝

In our next lesson, we'll learn how to:
- Connect different types of data
- Create todo lists that can have many todos
- Add tags to our todos
- Make our queries even more powerful!

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-node-mysql)
- [SQL Tutorial](https://www.w3schools.com/sql/)
- [Database Design Basics](https://www.codecademy.com/learn/paths/design-databases-with-postgresql)
