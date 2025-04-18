const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');
const { validateTodo } = require('../middlewares/validation.middleware');
const authenticate = require('../middlewares/auth.middleware');

// Public routes
router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.getTodoById);

// Protected routes
router.post('/', authenticate, validateTodo, todoController.createTodo);
router.put('/:id', authenticate, validateTodo, todoController.updateTodo);
router.delete('/:id', authenticate, todoController.deleteTodo);

module.exports = router;