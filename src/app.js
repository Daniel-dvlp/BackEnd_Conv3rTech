const express = require('express');
const app = express();

app.use(express.json());

const categoryRoutes = require('./routes/products_category/ProductsCategoryRoutes');

app.use('/productsCategory', categoryRoutes);


module.exports = app;