const express = require('express');
const app = express();

app.use(express.json());

const UsersRoutes = require('./routes/Users/UsersRoutes');
app.use('/api/users', UsersRoutes);
const AddressClientsRoutes = require('./routes/Clients/AddressClientsRoutes');
app.use('/api/address-clients', AddressClientsRoutes);

module.exports = app;