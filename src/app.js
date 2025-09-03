const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Nuevo bloque de código para las asociaciones de Sequelize ---
// 1. Importar todos los modelos que tienen asociaciones
const sequelize = require('./config/database');
const Product = require('./models/products/Product');
const Supplier = require('./models/supplier/SupplierModel');
const Purchase = require('./models/purchase/PurchaseModel');
const PurchaseDetail = require('./models/purchase/PurchaseDetailModel');
const User = require('./models/users/Users');
const LaborScheduling = require('./models/labor_scheduling/LaborSchedulingModel');

// 2. Ejecutar las funciones de asociación de cada modelo
function setupAssociations() {
    const models = {
        Product,
        Supplier,
        Purchase,
        PurchaseDetail,
        User,
        LaborScheduling,
        // ... Agrega todos tus modelos aquí
    };

    Object.values(models).forEach(model => {
        if (model.associate) {
            model.associate(models);
        }
    });
}
setupAssociations();
// --- Fin del bloque de código nuevo ---


// ====================== RUTAS ======================

const rolesRoutes = require("./routes/auth/RolesRoutes");
const permissionsRoutes = require("./routes/auth/PermissionsRoutes");
const privilegesRoutes = require("./routes/auth/PrivilegesRoutes");
const RBACRoutes = require("./routes/auth/RBACRoutes");

app.use("/api/roles", rolesRoutes);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/privileges", privilegesRoutes);
app.use("/api/rbac", RBACRoutes);

const SupplierRoutes = require("./routes/supplier/SupplierRoutes");
app.use("/api/suppliers", SupplierRoutes);

const PurchaseRoutes = require("./routes/purchase/PurchaseRoutes");
app.use("/api/purchases", PurchaseRoutes);

const categoryRoutes = require("./routes/products_category/ProductsCategoryRoutes");
app.use("/api/productsCategory", categoryRoutes);

const ProductRoutes = require('./routes/products/ProductsRoutes');
app.use('/api/products/products', ProductRoutes)
const ProductFeatureRoutes = require('./routes/products/FeatureRoutes');
app.use('/api/products/features', ProductFeatureRoutes);
const DatasheetRoutes = require('./routes/products/DatasheetRoutes');
app.use('/api/products/datasheets', DatasheetRoutes);

const UsersRoutes = require("./routes/users/UsersRoutes");
app.use("/api/users", UsersRoutes);

const ClientsRoutes = require("./routes/clients/ClientsRoutes");
app.use("/api/clients", ClientsRoutes);

const AddressClientsRoutes = require("./routes/clients/AddressClientsRoutes");
app.use("/api/address-clients", AddressClientsRoutes);

const LaborSchedulingRoutes = require('./routes/labor_scheduling/LaborSchedulingRoutes');
app.use('/api/labor-scheduling', LaborSchedulingRoutes);

// ====================== UTILIDADES ======================

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Conv3rTech API está funcionando correctamente",
        timestamp: new Date().toISOString(),
    });
});

app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === "development" ? err.message : {},
    });
});

app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Ruta no encontrada",
    });
});

module.exports = app;