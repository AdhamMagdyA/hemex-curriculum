# Understanding Middleware

## Learning Objectives
By the end of this lesson, students will be able to:
- Understand middleware concept and execution flow
- Implement basic middleware functions
- Handle middleware errors
- Chain multiple middleware functions

## Prerequisites
- Express.js basics
- Error handling in Node.js
- Async/await understanding

## Lesson Content

### 1. What is Middleware?
Middleware functions are functions that have access to the request object (req), response object (res), and the next middleware function in the application's request-response cycle.

```javascript
// Basic middleware structure
const middleware = (req, res, next) => {
    // Do something with req or res
    next(); // Call next to pass control to the next middleware
};
```

### 2. Middleware Execution Flow
```javascript
const express = require('express');
const app = express();

// Middleware 1: Logs request time
app.use((req, res, next) => {
    console.log(`Request received at: ${new Date().toISOString()}`);
    next();
});

// Middleware 2: Adds request ID
app.use((req, res, next) => {
    req.requestId = Date.now();
    next();
});

// Route handler
app.get('/', (req, res) => {
    res.json({
        requestId: req.requestId,
        message: 'Hello World'
    });
});
```

### 3. Error Handling Middleware
```javascript
// Regular middleware
app.use((req, res, next) => {
    if (!req.headers.authorization) {
        // Create error and pass to error handler
        const error = new Error('Authorization required');
        error.status = 401;
        return next(error);
    }
    next();
});

// Error handling middleware (4 parameters)
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message,
            status: error.status
        }
    });
});
```

### 4. Middleware Types
```javascript
// Application-level middleware
app.use((req, res, next) => {
    // Runs for every request
});

// Router-level middleware
router.use((req, res, next) => {
    // Runs for specific router
});

// Route-specific middleware
app.get('/', middleware, (req, res) => {
    // Runs for specific route
});

// Error-handling middleware
app.use((err, req, res, next) => {
    // Handles errors
});
```

### 5. Async Middleware
```javascript
// Async middleware wrapper
const asyncMiddleware = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };
};

// Using async middleware
app.use(asyncMiddleware(async (req, res, next) => {
    const user = await db.findUser(req.userId);
    req.user = user;
    next();
}));
```

## Exercises
1. Create a logging middleware
2. Implement request timing middleware
3. Build error handling middleware
4. Chain multiple middleware functions

## Additional Resources
- [Express.js Middleware Guide](https://expressjs.com/en/guide/using-middleware.html)
- [Writing Middleware](https://expressjs.com/en/guide/writing-middleware.html)
- [Error Handling](https://expressjs.com/en/guide/error-handling.html)

## Teaching Notes
- Draw middleware flow diagrams
- Show middleware execution order
- Demonstrate error propagation
- Explain common use cases
- Cover async middleware patterns

## Common Issues & Solutions
1. Forgetting to call next()
2. Calling next() multiple times
3. Not handling async errors
4. Middleware order issues
5. Response after next()

## Homework
Build a middleware system that includes:
- Request logging
- Response time tracking
- Error handling
- Authentication check
- Request validation
- Response transformation
