const express = require('express');
const todoRoutes = require('./routes/todo.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());

app.use('/todos', todoRoutes);

app.use(errorMiddleware);

module.exports = app;