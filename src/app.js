const express = require('express');
const app = express();

app.use(express.json());

//Miguel
const SupplierRoutes = require('./routes/supplier/SupplierRoutes');
app.use('/api/suppliers', SupplierRoutes);
const PurchaseRoutes = require('./routes/purchase/PurchaseRoutes');
app.use('/api/purchases', PurchaseRoutes);

//Sarai
const categoryRoutes = require('./routes/products_category/ProductsCategoryRoutes');
app.use('/api/productsCategory', categoryRoutes);

//Luissy
const UsersRoutes = require('./routes/Users/UsersRoutes');
app.use('/api/users', UsersRoutes);
const AddressClientsRoutes = require('./routes/Clients/AddressClientsRoutes');
app.use('/api/address-clients', AddressClientsRoutes);

module.exports = app;
