# JWT Authentication Fundamentals

## Learning Objectives
By the end of this lesson, students will be able to:
- Understand JWT structure and purpose
- Implement JWT generation and validation
- Handle token expiration and refresh
- Secure API endpoints with JWT

## Prerequisites
- Node.js and Express.js knowledge
- Basic cryptography concepts
- Understanding of HTTP headers

## Lesson Content

### 1. Understanding JWT Structure
```javascript
// JWT consists of three parts:
// 1. Header (algorithm & token type)
// 2. Payload (data)
// 3. Signature (verification)

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

// Creating a JWT
const payload = {
    userId: user.id,
    email: user.email
};

const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: '1h' // Token expires in 1 hour
});
```

### 2. Implementing JWT Authentication
```javascript
// auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthService {
    static async generateToken(user) {
        return jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    }

    static async verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    static async hashPassword(password) {
        return bcrypt.hash(password, 10);
    }

    static async comparePasswords(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
}

module.exports = AuthService;
```

### 3. Login Implementation
```javascript
// routes/auth.js
const express = require('express');
const router = express.Router();
const AuthService = require('../services/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Verify password
        const isValid = await AuthService.comparePasswords(
            password,
            user.password
        );

        if (!isValid) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = await AuthService.generateToken(user);

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error during login'
        });
    }
});

module.exports = router;
```

### 4. Token Validation Middleware
```javascript
// middleware/auth.js
const AuthService = require('../services/auth');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Authentication required'
            });
        }

        const decoded = await AuthService.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Invalid token'
        });
    }
};

module.exports = authMiddleware;
```

## Security Best Practices
1. Never store tokens in localStorage (use httpOnly cookies)
2. Implement token refresh mechanism
3. Use secure password hashing (bcrypt)
4. Implement rate limiting
5. Set proper token expiration
6. Use environment variables for secrets

## Exercises
1. Implement a complete login/register system
2. Add password reset functionality
3. Implement token refresh mechanism
4. Add rate limiting to auth routes

## Additional Resources
- [JWT.io](https://jwt.io/)
- [OWASP Authentication Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Node.js Security Best Practices](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)

## Teaching Notes
- Emphasize security implications
- Demonstrate token debugging using jwt.io
- Show common attack vectors
- Discuss token storage options
- Cover error handling scenarios

## Common Issues & Solutions
1. Token exposure in frontend
2. Improper error handling
3. Missing token validation
4. Insecure password storage
5. Token expiration handling

## Homework
Build a secure authentication system with:
- User registration and login
- Password reset functionality
- Email verification
- Token refresh mechanism
- Protected routes
- Rate limiting
- Security headers
