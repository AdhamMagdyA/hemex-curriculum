const todoService = require('../services/todo.service');

const todoController = {
  getAllTodos: async (req, res, next) => {
    try {
      const todos = await todoService.getAllTodos();
      res.json(todos);
    } catch (error) {
      next(error);
    }
  },

  getTodoById: async (req, res, next) => {
    try {
      const todo = await todoService.getTodoById(req.params.id);
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.json(todo);
    } catch (error) {
      next(error);
    }
  },

  createTodo: async (req, res, next) => {
    try {
      const newTodo = await todoService.createTodo(req.body);
      res.status(201).json(newTodo);
    } catch (error) {
      next(error);
    }
  },

  updateTodo: async (req, res, next) => {
    try {
      const updatedTodo = await todoService.updateTodo(req.params.id, req.body);
      if (!updatedTodo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.json(updatedTodo);
    } catch (error) {
      next(error);
    }
  },

  deleteTodo: async (req, res, next) => {
    try {
      await todoService.deleteTodo(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = todoController;