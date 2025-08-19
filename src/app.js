const express = require('express');
const app = express();

app.use(express.json());

const categoryRoutes = require('./routes/products_category/ProductsCategoryRoutes');

app.use('/api/productsCategory', categoryRoutes);

const categoryRoutes = require('./routes/products_category/ProductsCategoryRoutes');
app.use('/api/productsCategory', categoryRoutes);

const UsersRoutes = require('./routes/Users/UsersRoutes');
app.use('/api/users', UsersRoutes);

const AddressClientsRoutes = require('./routes/Clients/AddressClientsRoutes');
app.use('/api/address-clients', AddressClientsRoutes);

module.exports = app;