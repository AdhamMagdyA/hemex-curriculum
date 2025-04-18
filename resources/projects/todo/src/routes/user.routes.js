const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

// User CRUD
router.post('/', userController.create);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

// User-Todo relationships
router.post('/:userId/todos', userController.addTodo);
router.get('/:userId/todos', userController.getTodos);
router.post('/with-todos', userController.createWithTodos);

module.exports = router;
