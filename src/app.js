const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar asociaciones de modelos básicas
require("./models/associations");

// Comentar temporalmente las asociaciones de proyectos para evitar conflictos
// require("./models/projects/associations");

// ====================== RUTAS ======================

// Rutas de autenticación
const authRoutes = require("./routes/auth/auth_routes");
app.use("/api/auth", authRoutes);

// Rutas de roles y permisos
const rolesRoutes = require("./routes/auth/RolesRoutes");
const permissionsRoutes = require("./routes/auth/PermissionsRoutes");
const privilegesRoutes = require("./routes/auth/PrivilegesRoutes");
const RBACRoutes = require("./routes/auth/RBACRoutes");

app.use("/api/roles", rolesRoutes);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/privileges", privilegesRoutes);
app.use("/api/rbac", RBACRoutes);

// Rutas de proyectos (comentadas temporalmente)
// const ProjectRoutes = require("./routes/projects/ProjectRoutes");
// app.use("/api/projects", ProjectRoutes);

// Rutas de proveedores (comentadas temporalmente)
const SupplierRoutes = require("./routes/supplier/SupplierRoutes");
app.use("/api/suppliers", SupplierRoutes);

// Rutas de compras (comentadas temporalmente)
const PurchaseRoutes = require("./routes/purchase/PurchaseRoutes");
app.use("/api/purchases", PurchaseRoutes);

// Rutas de categorías de productos (comentadas temporalmente)
const categoryRoutes = require("./routes/products_category/ProductsCategoryRoutes");
app.use("/api/productsCategory", categoryRoutes);

//Ruta para productos
const ProductFeatureRoutes = require('./routes/products/FeatureRoutes');
app.use('/api/products/features', ProductFeatureRoutes);
const DatasheetRoutes = require('./routes/products/DatasheetRoutes');
app.use('/api/products/datasheets', DatasheetRoutes);

// Rutas de usuarios
const UsersRoutes = require("./routes/users/UsersRoutes");
app.use("/api/users", UsersRoutes);

// Rutas de clientes
const ClientsRoutes = require("./routes/clients/ClientsRoutes");
app.use("/api/clients", ClientsRoutes);

// Rutas de direcciones de clientes
const AddressClientsRoutes = require("./routes/clients/AddressClientsRoutes");
app.use("/api/address-clients", AddressClientsRoutes);

// ====================== UTILIDADES ======================

// Ruta de prueba (health check)
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Conv3rTech API está funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// Ruta para manejar rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

module.exports = app;
