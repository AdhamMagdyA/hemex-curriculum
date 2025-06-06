const todoService = require('../services/todo.service');

class TodoController {
  // Get all todos (optionally filtered by user)
  async getAllTodos(req, res, next) {
    try {
      const todos = await todoService.getAllTodos(req.query.userId || req.user?.id);
      res.json(todos);
    } catch (error) {
      next(error);
    }
  }

  // Get todo by ID (optional)
  async getTodoById(req, res, next) {
    try {
      const todo = await todoService.getTodoById(parseInt(req.params.id));
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.json(todo);
    } catch (error) {
      next(error);
    }
  }

  // Create todo (with user relationship)
  async createTodo(req, res, next) {
    try {
      const newTodo = await todoService.createTodo({
        ...req.body,
        userId: req.user.id // Use authenticated user
      });
      res.status(201).json(newTodo);
    } catch (error) {
      next(error);
    }
  }

  // Update todo (ensuring it belongs to user)
  async updateTodo(req, res, next) {
    try {
      const todo = await todoService.updateTodo(
        parseInt(req.params.id),
        req.user.id, // Assuming user ID comes from auth middleware
        req.body
      );
      res.json(todo);
    } catch (error) {
      next(error);
    }
  }

  // Delete todo (ensuring it belongs to user)
  async deleteTodo(req, res, next) {
    try {
      await todoService.deleteTodo(
        parseInt(req.params.id),
        req.user.id // Assuming user ID comes from auth middleware
      );
      res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TodoController();