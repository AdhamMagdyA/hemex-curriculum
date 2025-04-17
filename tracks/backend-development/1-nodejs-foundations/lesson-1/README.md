# Building CRUD Applications

## Learning Objectives
By the end of this lesson, students will be able to:
- Set up a basic Express.js application
- Implement RESTful API endpoints
- Handle HTTP methods (GET, POST, PUT, DELETE)
- Structure routes and controllers properly

## Prerequisites
- Node.js installed
- Basic JavaScript knowledge
- Understanding of HTTP methods

## Lesson Content

### 1. Setting Up Express.js
```javascript
const express = require('express');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### 2. Creating a Basic CRUD Structure
```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// In-memory data store (will be replaced with DB later)
let users = [];

// GET all users
router.get('/', (req, res) => {
    res.json(users);
});

// GET single user
router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

// POST new user
router.post('/', (req, res) => {
    const user = {
        id: Date.now().toString(),
        ...req.body
    };
    users.push(user);
    res.status(201).json(user);
});

// PUT update user
router.put('/:id', (req, res) => {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'User not found' });
    
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
});

// DELETE user
router.delete('/:id', (req, res) => {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'User not found' });
    
    users.splice(index, 1);
    res.status(204).send();
});

module.exports = router;
```

### 3. Proper Error Handling
```javascript
// middleware/error.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

// Apply in main app
app.use(errorHandler);
```

### 4. Testing API Endpoints
Using Postman/Insomnia to test:
- GET /users
- POST /users (with body)
- GET /users/:id
- PUT /users/:id
- DELETE /users/:id

## Exercises
1. Create a CRUD API for a "products" resource
2. Implement proper error handling
3. Add input validation
4. Test all endpoints using Postman

## Additional Resources
- [Express.js Documentation](https://expressjs.com/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)

## Teaching Notes
- Start with simple in-memory storage before introducing databases
- Emphasize proper HTTP status code usage
- Show common pitfalls in error handling
- Demonstrate live API testing
- Discuss the importance of proper route organization

## Common Issues & Solutions
1. Forgetting to parse JSON body
2. Not handling async errors
3. Improper status code usage
4. Missing error handling

## Homework
Build a simple blog API with posts and comments (in-memory storage):
- CRUD operations for posts
- CRUD operations for comments
- Basic input validation
- Error handling
- API documentation
