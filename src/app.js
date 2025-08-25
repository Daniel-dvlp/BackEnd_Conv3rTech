const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar asociaciones de modelos
require("./models/associations");

// Rutas de autenticación
const authRoutes = require("./routes/auth/auth_routes");
app.use("/api/auth", authRoutes);

// Rutas de roles y permisos
const rolesRoutes = require("./routes/auth/RolesRoutes");
const permissionsRoutes = require("./routes/auth/PermissionsRoutes");
const privilegesRoutes = require("./routes/auth/PrivilegesRoutes");

app.use("/api/roles", rolesRoutes);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/privileges", privilegesRoutes);

// Rutas existentes
const SupplierRoutes = require("./routes/supplier/SupplierRoutes");
app.use("/api/suppliers", SupplierRoutes);

const PurchaseRoutes = require("./routes/purchase/PurchaseRoutes");
app.use("/api/purchases", PurchaseRoutes);

const categoryRoutes = require("./routes/products_category/ProductsCategoryRoutes");
app.use("/api/productsCategory", categoryRoutes);

const UsersRoutes = require("./routes/users/UsersRoutes");
app.use("/api/users", UsersRoutes);

const AddressClientsRoutes = require("./routes/clients/AddressClientsRoutes");
app.use("/api/address-clients", AddressClientsRoutes);

// Rutas de proyectos
const ProjectRoutes = require("./routes/projects/ProjectRoutes");
app.use("/api/projects", ProjectRoutes);

const RBACRoutes = require("./routes/auth/RBACRoutes");
app.use("/api/rbac", RBACRoutes);

// Ruta de prueba
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
