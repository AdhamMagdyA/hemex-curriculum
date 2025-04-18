const prisma = require('../utils/prisma');

class UserService {
  // Create a new user
  async createUser(userData) {
    return prisma.user.create({
      data: userData
    });
  }

  // Create user with todos
  async createUserWithTodos(userData, todos) {
    return prisma.user.create({
      data: {
        ...userData,
        todos: {
          create: todos
        }
      }
    });
  }

  // Get all users with their todos
  async getAllUsersWithTodos() {
    return prisma.user.findMany({
      include: {
        todos: true
      }
    });
  }

  // Get user by ID with todos
  async getUserWithTodos(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        todos: true
      }
    });
  }

  // Update user
  async updateUser(userId, userData) {
    return prisma.user.update({
      where: { id: userId },
      data: userData
    });
  }

  // Delete user
  async deleteUser(userId) {
    return prisma.user.delete({
      where: { id: userId }
    });
  }

  // Add todo for specific user
  async addTodoForUser(userId, todoData) {
    return prisma.todo.create({
      data: {
        ...todoData,
        user: {
          connect: { id: userId }
        }
      }
    });
  }

  // Get todos for specific user
  async getTodosForUser(userId) {
    return prisma.todo.findMany({
      where: { userId }
    });
  }
}

module.exports = new UserService();
