# Backend Development Track

Master server-side programming, database integration, and API development using Node.js and modern JavaScript frameworks.

## Overview
This comprehensive track takes you from backend fundamentals to building production-ready applications. You'll progress through three major sections, culminating in a full e-commerce project implementation.

## Learning Journey

### 1. Introduction to Backend Development
- **Lesson 1**: Node.js Fundamentals & Core Modules
- **Lesson 2**: Express.js & RESTful API Design & Backend Projects Structure
- **Lesson 3**: Error Handling & Middlewares & Version control

### 2. ORM and Authentication
- **Lesson 1**: Database Design & Prisma ORM
- **Lesson 2**: Authentication & Authorization
- **Lesson 3**: Advanced Querying & Relationships

### 3. E-commerce Full Project
- **Lessons 1-10**: Comprehensive e-commerce API covering:
  - Product & Category Management
  - User Authentication & Authorization
  - Shopping Cart & Order Processing
  - Composing ERD & UML Diagrams
  - Payment Integration
  - Email Notifications
  - File Uploads
  - Advanced Search & Filtering
  - API Documentation
  - Testing & Deployment

## Track Objectives
By completing this track, you'll be able to:
- Gather requiremments from clients
- Draw analysis diagrams (ERD, Usecase Diagrams, Sequence Diagrams, etc.)
- Design and implement RESTful APIs using Node.js and Express
- Work with SQL databases using Prisma ORM
- Implement secure authentication and authorization
- Handle file uploads and email notifications
- Process payments and manage orders (using stirpe payment gateway)
- Write clean, maintainable, and well-documented code
- Deploy and scale backend applications

## Prerequisites
- Solid understanding of JavaScript (ES6+)
- Basic knowledge of Node.js and npm
- Understanding of REST API concepts
- Familiarity with databases (SQL preferred)
- Git version control basics

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT
- **Testing**: Jest
- **Documentation**: OpenAPI/Swagger

## Getting Started
1. Install Node.js (v18+ recommended)
2. Set up MySQL database (XAMPP or standalone)
3. Install dependencies: `npm install`
4. Configure environment variables (refer to `.env.example`)
5. Run database migrations: `npx prisma migrate dev`
6. Start the development server: `npm run dev`

## Resources
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [JWT Authentication](https://jwt.io/introduction/)

## Project Structure
```
backend/
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Custom middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── utils/         # Helper functions
│   └── app.js         # Express app setup
├── prisma/           # Prisma schema and migrations
└── tests/            # Test files
```
