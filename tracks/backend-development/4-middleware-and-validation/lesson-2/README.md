# Essential Express Middleware

## Learning Objectives
By the end of this lesson, students will be able to:
- Install and configure Morgan for logging
- Implement express-validator for request validation
- Use common Express.js middleware
- Configure middleware options

## Prerequisites
- Basic middleware understanding
- npm package management
- Express.js routing

## Lesson Content

### 1. Morgan Logger Setup
```javascript
const express = require('express');
const morgan = require('morgan');
const app = express();

// Basic morgan setup
app.use(morgan('dev'));

// Custom morgan format
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :body'));

// File logging
const fs = require('fs');
const path = require('path');

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));
```

### 2. Express Validator Implementation
```javascript
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateUser = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required'),
    
    // Validation check middleware
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        next();
    }
];

// Using validation in routes
app.post('/users', validateUser, (req, res) => {
    // Handle valid request
});
```

### 3. Common Express.js Middleware
```javascript
// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Helmet (security headers)
const helmet = require('helmet');
app.use(helmet());

// Compression
const compression = require('compression');
app.use(compression());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
```

### 4. Custom Validation Rules
```javascript
const { body, param, query } = require('express-validator');

// Custom validation chain
const validateProduct = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Product name too short'),
    
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be positive'),
    
    body('categories')
        .isArray()
        .withMessage('Categories must be an array')
        .custom((value) => {
            if (!value.every(cat => typeof cat === 'string')) {
                throw new Error('Categories must be strings');
            }
            return true;
        }),
    
    // Custom async validation
    body('sku').custom(async (value) => {
        const existing = await Product.findOne({ sku: value });
        if (existing) {
            throw new Error('SKU already exists');
        }
        return true;
    })
];
```

## Exercises
1. Set up different Morgan logging formats
2. Create complex validation chains
3. Implement rate limiting
4. Add security headers with Helmet

## Additional Resources
- [Morgan Documentation](https://github.com/expressjs/morgan)
- [Express Validator Guide](https://express-validator.github.io/docs/)
- [Helmet Documentation](https://helmetjs.github.io/)
- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)

## Teaching Notes
- Show logging output examples
- Demonstrate validation error handling
- Explain security implications
- Cover performance considerations

## Common Issues & Solutions
1. Morgan format syntax
2. Validation chain order
3. Rate limit configuration
4. CORS setup issues
5. Body parser limits

## Homework
Create an API with:
- Custom logging format
- Complex validation rules
- Rate limiting
- Security headers
- CORS configuration
- Compression
- Error handling middleware
