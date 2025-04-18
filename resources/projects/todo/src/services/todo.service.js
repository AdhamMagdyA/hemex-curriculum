const prisma = require('../utils/prisma');

class TodoService {
  // Get all todos (optionally filtered by user)
  async getAllTodos(userId) {
    const where = userId ? { userId } : {};
    return prisma.todo.findMany({ where });
  }

  // Get todo by id
  async getTodoById(id) {
    return await prisma.todo.findUnique({
      where: { id: parseInt(id) }
    });
  }

  // Create todo (with user relationship)
  async createTodo(todoData, userId) {
    return prisma.todo.create({
      data: {
        ...todoData,
        userId
      }
    });
  }

  // Update todo (ensuring it belongs to user)
  async updateTodo(id, userId, todoData) {
    return prisma.todo.update({
      where: { id, userId },
      data: todoData
    });
  }

  // Delete todo (ensuring it belongs to user)
  async deleteTodo(id, userId) {
    return prisma.todo.delete({
      where: { id, userId }
    });
  }
}

module.exports = new TodoService();