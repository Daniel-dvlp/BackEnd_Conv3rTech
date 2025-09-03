const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar asociaciones de autenticación

require("./models/auth/associations");

// Comentar temporalmente las asociaciones de proyectos para evitar conflictos
// require("./models/projects/associations");

// ====================== RUTAS ======================

// Rutas de autenticación
const authRoutes = require("./routes/auth/AuthRoutes");
app.use("/api/auth", authRoutes);

// Rutas de roles y permisos
const roleRoutes = require("./routes/auth/RoleRoutes");
app.use("/api/roles", roleRoutes);

// Rutas de permisos
const permissionsRoutes = require("./routes/auth/PermissionsRoutes");
app.use("/api/permissions", permissionsRoutes);

// Rutas de proyectos (comentadas temporalmente)
// const ProjectRoutes = require("./routes/projects/ProjectRoutes");
// app.use("/api/projects", ProjectRoutes);

// Rutas de proveedores (comentadas temporalmente)
const SupplierRoutes = require("./routes/supplier/SupplierRoutes");
app.use("/api/suppliers", SupplierRoutes);

// Rutas para proveedores
const SupplierRoutes = require('./routes/supplier/SupplierRoutes');
app.use('/api/suppliers', SupplierRoutes);

// Rutas para compras
const PurchaseRoutes = require('./routes/purchase/PurchaseRoutes');
app.use('/api/purchases', PurchaseRoutes);

// Rutas para categorias de productos
const categoryRoutes = require('./routes/products_category/ProductsCategoryRoutes');
app.use('/api/productsCategory', categoryRoutes);

//Ruta para productos
const ProductRoutes = require("./routes/products/ProductsRoutes");
app.use("/api/products/products", ProductRoutes);
const ProductFeatureRoutes = require("./routes/products/FeatureRoutes");
app.use("/api/products/features", ProductFeatureRoutes);
const DatasheetRoutes = require("./routes/products/DatasheetRoutes");
app.use("/api/products/datasheets", DatasheetRoutes);

// Rutas de usuarios
const UsersRoutes = require("./routes/users/UsersRoutes");
app.use("/api/users", UsersRoutes);
// Rutas para usuarios
const UsersRoutes = require('./routes/Users/UsersRoutes');
app.use('/api/users', UsersRoutes);

// Rutas para clientes
const ClientsRoutes = require('./routes/clients/ClientsRoutes');
app.use('/api/clients', ClientsRoutes);
const AddressClientsRoutes = require('./routes/clients/AddressClientsRoutes');
app.use('/api/address-clients', AddressClientsRoutes);

//Rutas de Categoria de Servicio
const ServiceCategoryRoutes = require('./routes/service_categories/ServiceCategoryRoutes');
app.use('/api/service-categories', ServiceCategoryRoutes);

// Rutas para servicios
const ServicesRoutes = require('./routes/services/ServicesRoutes');
app.use('/api/services', ServicesRoutes);



module.exports = app;
