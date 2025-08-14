const express = require('express');
const app = express();

app.use(express.json());

const UsersRoutes = require('./routes/Users/UsersRoutes');
app.use('/api/users', UsersRoutes);

module.exports = app;