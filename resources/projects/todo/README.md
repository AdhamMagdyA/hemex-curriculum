# Todo API with Authentication

A secure todo list API with user authentication built with Node.js, Express, Prisma and JWT.

## Features
- **User Authentication**
  - JWT token-based authentication
  - Password hashing with bcrypt
  - Protected routes
- **Todo Management**
  - Create todos linked to users
  - Update/delete only owner's todos
  - Filter todos by user
- **Database**
  - MySQL with Prisma ORM
  - Automatic migrations

## Setup
1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up database:
```bash
npx prisma migrate dev
```
4. Configure environment variables:
```env
DATABASE_URL="mysql://user:password@localhost:3306/todo_app"
JWT_SECRET="your-secret-key"
```
5. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Todos (Require Authentication)
- `POST /todos` - Create new todo
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo

### Public
- `GET /todos` - Get all todos (filter by user with ?userId=)
- `GET /todos/:id` - Get single todo

## Testing
Run tests with:
```bash
npm test
```

Tests cover:
- Authentication flow
- Route protection
- User-todo relationships
