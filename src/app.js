const express = require('express');
const app = express();

app.use(express.json());

// Rutas
const serviceCategoryRoutes = require('./routes/service_categories/ServiceCategoryRoutes');
app.use('/api/service-categories', serviceCategoryRoutes);



module.exports = app;
