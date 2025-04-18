const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    
    // Prisma error handling
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
  
    res.status(500).json({ message: 'Something went wrong!' });
  };
  
  module.exports = errorMiddleware;