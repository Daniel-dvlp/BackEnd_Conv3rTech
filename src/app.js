const express = require('express');
const app = express();

app.use(express.json());

// Rutas para proveedores
const SupplierRoutes = require('./routes/supplier/SupplierRoutes');
app.use('/api/suppliers', SupplierRoutes);

// Rutas para compras
const PurchaseRoutes = require('./routes/purchase/PurchaseRoutes');
app.use('/api/purchases', PurchaseRoutes);

// Rutas para categorias de productos
const categoryRoutes = require('./routes/products_category/ProductsCategoryRoutes');
app.use('/api/productsCategory', categoryRoutes);

// Rutas para catergoria de servicios
const serviceCategoryRoutes = require('./routes/service_categories/ServiceCategoryRoutes');
app.use('/api/service-categories', serviceCategoryRoutes);

// Rutas para usuarios
const UsersRoutes = require('./routes/Users/UsersRoutes');
app.use('/api/users', UsersRoutes);

// Rutas para clientes
const ClientsRoutes = require('./routes/clients/ClientsRoutes');
app.use('/api/clients', ClientsRoutes);
const AddressClientsRoutes = require('./routes/clients/AddressClientsRoutes');
app.use('/api/address-clients', AddressClientsRoutes);

module.exports = app;
