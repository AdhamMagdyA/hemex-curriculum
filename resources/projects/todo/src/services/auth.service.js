const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');

class AuthService {
  static async register(userData) {
    console.log(userData)
    // Hash password before saving
    const hashedPassword = await this.hashPassword(userData.password);
    return prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword
      }
    });
  }

  static async login(email, password) {
    // 1. Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    // 2. Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid password');

    // 3. Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    return { user, token };
  }

  static verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  }

  static async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }
}

module.exports = AuthService;
