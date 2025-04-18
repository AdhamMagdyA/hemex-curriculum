const validateTodo = (req, res, next) => {
    if (!req.body.title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    next();
  };
  
  module.exports = {
    validateTodo
  };