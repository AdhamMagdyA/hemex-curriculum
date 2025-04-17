# User Management System

## Learning Objectives
By the end of this lesson, students will be able to:
- Implement user registration and login
- Handle password hashing and validation
- Manage user sessions
- Implement email verification
- Handle password reset flow

## Prerequisites
- JWT understanding
- Prisma ORM knowledge
- Express.js routing
- Email service setup (e.g., Nodemailer)

## Lesson Content

### 1. User Schema with Prisma
```prisma
// schema.prisma
model User {
    id            Int      @id @default(autoincrement())
    email         String   @unique
    password      String
    name          String?
    isVerified    Boolean  @default(false)
    verifyToken   String?
    resetToken    String?
    resetExpires  DateTime?
    createdAt     DateTime @default(now())
    updatedAt     DateTime @updatedAt
}
```

### 2. User Registration Implementation
```javascript
// controllers/user.controller.js
const { PrismaClient } = require('@prisma/client');
const AuthService = require('../services/auth');
const EmailService = require('../services/email');
const prisma = new PrismaClient();

class UserController {
    static async register(req, res) {
        try {
            const { email, password, name } = req.body;

            // Check if user exists
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                return res.status(400).json({
                    message: 'Email already registered'
                });
            }

            // Hash password
            const hashedPassword = await AuthService.hashPassword(password);

            // Generate verification token
            const verifyToken = AuthService.generateVerificationToken();

            // Create user
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    verifyToken
                }
            });

            // Send verification email
            await EmailService.sendVerificationEmail(
                email,
                verifyToken
            );

            res.status(201).json({
                message: 'Registration successful. Please verify your email.'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error during registration'
            });
        }
    }

    static async verifyEmail(req, res) {
        try {
            const { token } = req.params;

            const user = await prisma.user.findFirst({
                where: { verifyToken: token }
            });

            if (!user) {
                return res.status(400).json({
                    message: 'Invalid verification token'
                });
            }

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    isVerified: true,
                    verifyToken: null
                }
            });

            res.json({
                message: 'Email verified successfully'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error during verification'
            });
        }
    }
}

module.exports = UserController;
```

### 3. Password Reset Flow
```javascript
// controllers/auth.controller.js
class AuthController {
    static async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;

            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            const resetToken = AuthService.generateResetToken();
            const resetExpires = new Date(Date.now() + 3600000); // 1 hour

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetToken,
                    resetExpires
                }
            });

            await EmailService.sendPasswordResetEmail(
                email,
                resetToken
            );

            res.json({
                message: 'Password reset email sent'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error requesting password reset'
            });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;

            const user = await prisma.user.findFirst({
                where: {
                    resetToken: token,
                    resetExpires: {
                        gt: new Date()
                    }
                }
            });

            if (!user) {
                return res.status(400).json({
                    message: 'Invalid or expired reset token'
                });
            }

            const hashedPassword = await AuthService.hashPassword(newPassword);

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    resetToken: null,
                    resetExpires: null
                }
            });

            res.json({
                message: 'Password reset successful'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error resetting password'
            });
        }
    }
}
```

## Exercises
1. Implement complete user registration flow
2. Add email verification system
3. Create password reset functionality
4. Add user profile management

## Additional Resources
- [Nodemailer Documentation](https://nodemailer.com/)
- [Password Reset Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
- [Email Verification Patterns](https://documentation.mailgun.com/en/latest/best_practices.html#email-verification)

## Teaching Notes
- Demonstrate complete flow with Postman
- Show email testing techniques
- Discuss security considerations
- Cover edge cases and error handling

## Common Issues & Solutions
1. Email delivery issues
2. Token expiration handling
3. Race conditions in verification
4. Password complexity requirements
5. Email template management

## Homework
Implement a complete user management system with:
- User registration with email verification
- Password reset functionality
- User profile updates
- Account deletion
- Session management
- Email notifications for security events
