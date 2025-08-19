const express = require('express');
const app = express();

app.use(express.json());

const SupplierRoutes = require('./routes/supplier/SupplierRoutes');
app.use('/api/suppliers', SupplierRoutes);
const PurchaseRoutes = require('./routes/purchase/PurchaseRoutes');
app.use('/api/purchases', PurchaseRoutes);

module.exports = app;
