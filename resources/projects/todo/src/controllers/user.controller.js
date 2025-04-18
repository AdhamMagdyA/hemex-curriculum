const userService = require('../services/user.service');

class UserController {
  // Create a new user
  async create(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  // Create user with todos
  async createWithTodos(req, res, next) {
    try {
      const { user, todos } = req.body;
      const newUser = await userService.createUserWithTodos(user, todos);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  // Get all users with their todos
  async getAll(req, res, next) {
    try {
      const users = await userService.getAllUsersWithTodos();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  // Get user by ID with todos
  async getById(req, res, next) {
    try {
      const user = await userService.getUserWithTodos(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  // Update user
  async update(req, res, next) {
    try {
      const user = await userService.updateUser(
        parseInt(req.params.id),
        req.body
      );
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  // Delete user
  async delete(req, res, next) {
    try {
      await userService.deleteUser(parseInt(req.params.id));
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Add todo for user
  async addTodo(req, res, next) {
    try {
      const todo = await userService.addTodoForUser(
        parseInt(req.params.userId),
        req.body
      );
      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  }

  // Get todos for user
  async getTodos(req, res, next) {
    try {
      const todos = await userService.getTodosForUser(parseInt(req.params.userId));
      res.json(todos);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
