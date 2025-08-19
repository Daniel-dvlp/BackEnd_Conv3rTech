const express = require('express');
const app = express();

app.use(express.json());

const categoryRoutes = require('./routes/products_category/ProductsCategoryRoutes');

app.use('/api/productsCategory', categoryRoutes);


module.exports = app;