# The Magic Kitchen: Understanding Node.js 🏃‍♂️

## Lesson Overview

Welcome to Node.js's Magic Kitchen! Today we'll learn how Node.js works by imagining it as a super-efficient fast-food kitchen. We'll see how it handles many tasks at once and build our own todo list app!

## For Instructors

### Lesson Objectives

Students will learn:
- How Node.js works using the kitchen analogy
- Understanding non-blocking operations
- Building a structured Node.js application

### Teaching Strategy

- Use the fast-food kitchen analogy throughout the lesson
- Demonstrate blocking vs non-blocking with real examples
- Build the todo app step by step
- Encourage students to think about efficiency

## The Magic Kitchen Analogy 🍔

### Understanding Node.js Architecture

Imagine Node.js as a fast-food kitchen:
- **V8 Engine** = The Chef's Brain 👨‍🍳
  - Understands and executes JavaScript code
  - Makes quick decisions
  - Processes orders (your code)

- **libuv** = Kitchen Staff 👥
  - Handles tasks like reading files (getting ingredients)
  - Manages network requests (taking orders)
  - Works on multiple things at once

- **Event Loop** = Head Chef 👨‍🍳
  - Keeps checking if tasks are done
  - Assigns new tasks to workers
  - Makes sure everything runs smoothly

### Code Examples

#### Blocking Code (Bad Kitchen) 🚫
```javascript
// This is like a chef who stops everything to wait for fries
const fs = require('fs');
const data = fs.readFileSync('menu.txt', 'utf8');
console.log('Got the menu!');
console.log('Can take next order...'); // Has to wait!
```

#### Non-Blocking Code (Good Kitchen) ✨
```javascript
// This is like a chef who asks the kitchen staff to prepare fries
// while they continue making burgers
const fs = require('fs');
fs.readFile('menu.txt', 'utf8', (err, data) => {
    if (err) {
        console.log('Oops, menu not found!');
        return;
    }
    console.log('Got the menu!');
});
console.log('Can take next order!'); // Doesn't have to wait!
```

## Building Our Express Todo App 📝

### App Structure
```
todo-app/
├── src/
│   ├── controllers/            # Request handlers
│   ├── middlewares/             # Express middleware
│   ├── routes/                  # API route definitions
│   ├── services/                # Business logic
│   ├── errors/                  # Custom error classes
│   ├── utils/                   # Utility functions
│   ├── app.js                   # Express app configuration
│   └── server.js                # Server startup
├── prisma/                      # Database ORM
│   └── schema.prisma            # Database schema
├── tests/                       # Test files
├── .env                         # Environment variables
├── .env.example                 # Example environment variables
└── package.json                 # Project dependencies and scripts
```

#### teaching note

- the prisma file can also be refered as the models of the application

- explain the concept of models and what is the mapping of objects to db tables

- gradually build the todo app with simple APIs at the beginning (don't go deep in prisma relationships as it has another section specified for it, don't craete middlewares as they are also being covered in the next lesson)

### 1. Main Application (app.js)
```javascript
const express = require('express');
const todoRoutes = require('./src/routes/todoRoutes');

// Create our magical todo app! ✨
const app = express();

// Tell our app to understand JSON 📦
app.use(express.json());

// Use our todo routes
app.use('/api/todos', todoRoutes);

// Start our app's kitchen! 🏃‍♂️
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Our todo kitchen is running on port ${PORT}! 🚀`);
});
```

### 2. Todo Model (Prisma Schema)

In Prisma, models are defined in the schema file and represent database tables. Here's how our Todo model looks in the Prisma schema (prisma/schema.prisma):

```prisma
model Todo {
  id        Int      @id @default(autoincrement())
  task      String
  completed Boolean  @default(false)
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  createdAt DateTime @default(now())
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  todos     Todo[]
  createdAt DateTime @default(now())
}
```

This is equivalent to defining a JavaScript class but is specifically for database modeling. The key differences from a plain JavaScript class are:

1. **Database Mapping**: Each model maps directly to a database table
2. **Relationships**: Defined using `@relation` (like `user` in Todo)
3. **Type Safety**: Strong typing for all fields
4. **Default Values**: Set with `@default()`
5. **Database Constraints**: Like `@id`, `@unique` are database-level validations

In your JavaScript code, you don't need to write the model class manually - Prisma Client generates TypeScript types and database access methods based on this schema.

### 3. Todo Service (src/services/todo.service.js)
```javascript
const prisma = require('../utils/prisma');
const { ValidationError } = require('../errors');

class TodoService {
  // Get all todos (optionally filtered by user)
  async getAllTodos(userId) {
    const where = userId ? { userId } : {};
    return prisma.todo.findMany({ where });
  }

  // Get todo by id
  async getTodoById(id) {
    return await prisma.todo.findUnique({
      where: { id: parseInt(id) }
    });
  }

  // Create todo (with user relationship)
  async createTodo(todoData) {
    if (!todoData.task || typeof todoData.task !== 'string') {
      throw new ValidationError('Task is required and must be a non-empty string');
    }
    
    if (!todoData.userId) {
      throw new ValidationError('User ID is required');
    }

    return prisma.todo.create({
      data: {
        task: todoData.task,
        completed: todoData.completed || false,
        userId: todoData.userId
      }
    });
  }

  // Update todo (ensuring it belongs to user)
  async updateTodo(id, userId, todoData) {
    return prisma.todo.update({
      where: { id, userId },
      data: todoData
    });
  }

  // Delete todo (ensuring it belongs to user)
  async deleteTodo(id, userId) {
    return prisma.todo.delete({
      where: { id, userId }
    });
  }
}

module.exports = new TodoService();
```

### 4. Todo Controller (src/controllers/todoController.js)
```javascript
const todoService = require('../services/todoService');

class TodoController {
    // Get all todos (like viewing the menu)
    async getAllTodos(req, res) {
        try {
            const todos = todoService.getAllTodos();
            res.json(todos);
        } catch (error) {
            res.status(500).json({ message: 'Kitchen error! 🔥' });
        }
    }

    // Add a new todo (like placing an order)
    async createTodo(req, res) {
        try {
            const { task } = req.body;
            if (!task) {
                return res.status(400).json({ message: 'Need to know what to cook! 👨‍🍳' });
            }
            const todo = todoService.addTodo(task);
            res.status(201).json(todo);
        } catch (error) {
            res.status(500).json({ message: 'Kitchen error! 🔥' });
        }
    }

    // Update a todo (like modifying an order)
    async updateTodo(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const todo = todoService.updateTodo(Number(id), updates);
            if (!todo) {
                return res.status(404).json({ message: 'Order not found! 🤔' });
            }
            res.json(todo);
        } catch (error) {
            res.status(500).json({ message: 'Kitchen error! 🔥' });
        }
    }

    // Delete a todo (like canceling an order)
    async deleteTodo(req, res) {
        try {
            const { id } = req.params;
            const todo = todoService.deleteTodo(Number(id));
            if (!todo) {
                return res.status(404).json({ message: 'Order not found! 🤔' });
            }
            res.json({ message: 'Order canceled! ✅' });
        } catch (error) {
            res.status(500).json({ message: 'Kitchen error! 🔥' });
        }
    }
}

module.exports = new TodoController();
```

### 5. Todo Routes (src/routes/todoRoutes.js)
```javascript
const express = require('express');
const todoController = require('../controllers/todoController');

const router = express.Router();

// Our menu of available actions! 📝
router.get('/', todoController.getAllTodos);      // View all todos
router.post('/', todoController.createTodo);      // Create a new todo
router.put('/:id', todoController.updateTodo);    // Update a todo
router.delete('/:id', todoController.deleteTodo); // Delete a todo

module.exports = router;
```

### Testing Our Kitchen! 🧪
Use Postman or another tool to send requests to our Todo App at `http://localhost:3000/api/todos`:

- Get all todos: `GET /`
- Create a new todo: `POST /`
- Update a todo: `PUT /{id}`
- Delete a todo: `DELETE /{id}`

## Exercises

### 1. Kitchen Simulation
Create scenarios where:
- The kitchen gets very busy (many file operations)
- Some orders take longer than others (setTimeout)
- Orders need to be prioritized (Promise.race)

### 2. Enhance the Todo App
Add features like:
1. Due dates for todos
2. Priority levels (urgent, normal, low)
3. Categories (school, home, fun)
4. Todo search function

### 3. Make it Non-Blocking
Convert the todo app to use:
1. File storage instead of memory
2. Async operations for reading/writing
3. Promise-based operations

## Additional Resources

- [Node.js Event Loop Visualization](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick)
- [Building Node.js Applications](https://nodejs.dev/learn)
- [JavaScript Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
