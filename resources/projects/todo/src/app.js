const express = require('express');
const todoRoutes = require('./routes/todo.routes');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);
app.use('/users', userRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;