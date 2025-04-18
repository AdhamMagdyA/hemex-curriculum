const validateTodo = (req, res, next) => {
  if (!req.body.task) {
    return res.status(400).json({ message: 'Task is required' });
  }
  next();
};

module.exports = {
  validateTodo
};