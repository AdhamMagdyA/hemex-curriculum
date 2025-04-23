const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// Routes will be added here
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminUserRoutes = require('./routes/admin/user');
const errorHandler = require('./middlewares/errorHandler');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminUserRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
