const prisma = require('../utils/prisma');

const todoService = {
  getAllTodos: async () => {
    return await prisma.todo.findMany();
  },

  getTodoById: async (id) => {
    return await prisma.todo.findUnique({
      where: { id: parseInt(id) }
    });
  },

  createTodo: async (todoData) => {
    return await prisma.todo.create({
      data: {
        title: todoData.title,
        completed: todoData.completed || false
      }
    });
  },

  updateTodo: async (id, todoData) => {
    return await prisma.todo.update({
      where: { id: parseInt(id) },
      data: {
        title: todoData.title,
        completed: todoData.completed
      }
    });
  },

  deleteTodo: async (id) => {
    return await prisma.todo.delete({
      where: { id: parseInt(id) }
    });
  }
};

module.exports = todoService;