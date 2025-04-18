# The Magic Keys and Secret Passwords 🔐

## Lesson Overview

Welcome to our adventure in authentication! Today we'll learn about JWT (magic keys) and how to protect our todo app with secret passwords. We'll turn our app into a secure castle where only the right users can enter!

## For Instructors

### Lesson Objectives

Students will learn:
- Why we need authentication (castle protection)
- Different authentication approaches (keys vs passwords vs magic)
- JWT tokens as our magic keys
- Implementing JWT in our todo app
- Creating auth middleware (gatekeepers)

### Teaching Strategy

- Use castle/keys analogy throughout
- Interactive JWT website exploration
- Hands-on implementation with the todo app
- Role-playing as different parts of the system

## Part 1: Magic Keys (JWT) ✨

### Why We Need Authentication

Imagine our todo app is a castle:
- 🏰 Without authentication: Anyone can enter and mess with our stuff!
- 🔐 With authentication: Only people with the right key can enter

### Types of Keys

1. **Session Keys** (Like physical keys)  
   - Heavy to carry (server stores them)  
   - Hard to make copies (scales poorly)  

2. **Magic Keys (JWT)**  
   - Self-contained (has all info inside)  
   - Easy to verify (just need the secret spell)  
   - Can expire (keys stop working after time)  

### JWT Structure

Let's break down a magic key:
```
header.payload.signature
```

1. **Header** (Key's appearance)  
   ```json
   {
     "alg": "HS256",  // The magic spell used
     "typ": "JWT"     // It's a magic key!
   }
   ```

2. **Payload** (Key's powers)  
   ```json
   {
     "userId": 123,          // Who owns this key
     "name": "Wizard Alice", // Extra info
     "exp": 1735689600       // When it stops working ⏳
   }
   ```

3. **Signature** (The real magic)  
   - Made by combining header+payload with our SECRET spell  
   - Ensures no one can fake the key!  

### Activity: JWT Playground
Visit [jwt.io](https://jwt.io) and:
1. Create your own token (make a magic key)
2. Change the payload (add your own powers)
3. Try breaking the signature (see what happens!)

## Part 2: Protecting Our Castle 🏰

### Implementing JWT in Todo App

#### 1. Install Magic Spells (Packages)
```bash
npm install jsonwebtoken bcryptjs
```

#### 2. Create Auth Service (Key Maker)
```javascript
// services/auth.service.js
const jwt = require('jsonwebtoken');
const SECRET = 'our-magic-spell'; // In real life, use environment variables!

class AuthService {
  // Make a new magic key
  static generateToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email }, // Payload
      SECRET,                                 // Secret spell
      { expiresIn: '1h' }                     // Key expires in 1 hour
    );
  }

  // Check if a key is valid
  static verifyToken(token) {
    return jwt.verify(token, SECRET);
  }
}
```

#### 3. Create Auth Middleware (Gatekeeper)
```javascript
// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

function authGuard(req, res, next) {
  // 1. Check for magic key (in Authorization header)
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No magic key provided! 🔑' });

  try {
    // 2. Verify the key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Add user to request (now they can enter!)
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid magic key! 🧙‍♂️' });
  }
}
```

### Activity: Castle Defense Game 🎮

1. Divide students into:
   - Key Makers (Auth Service)
   - Gatekeepers (Middleware)
   - Visitors (Requests)

2. Visitors try to enter with:
   - No key
   - Fake key
   - Expired key
   - Valid key

3. Gatekeepers must check each one!

## Exercises

### 1. Token Factory
1. Create a route that makes magic keys (`/auth/login`)
2. Try making keys with different:
   - Expiration times
   - User data
3. Test them in [jwt.io](https://jwt.io)

### 2. Protected Routes
1. Add the auth guard to todo routes
2. Test with:
   ```bash
   # Get a key first
   curl -X POST http://localhost:3000/auth/login -d '{"email":"user@test.com","password":"123"}'
   
   # Use the key
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/todos
   ```

## Additional Resources

- [JWT Official Site](https://jwt.io)
- [Bcrypt for Passwords](https://www.npmjs.com/package/bcryptjs)
- [HTTP Status Cats](https://http.cat/) (Fun way to learn status codes)

---