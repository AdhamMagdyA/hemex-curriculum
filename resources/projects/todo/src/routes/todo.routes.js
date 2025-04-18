const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');
const { validateTodo } = require('../middlewares/validation.middleware');

router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.getTodoById);
router.post('/', validateTodo, todoController.createTodo);
router.put('/:id', validateTodo, todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;