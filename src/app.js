const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
const corsOptions = {
  origin: (origin, cb) => cb(null, true),
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- NUEVO: Servir la carpeta uploads como pública ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- NUEVO: Configuración de multer para subir imágenes ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// --- NUEVO: Endpoint para subir imágenes (requiere autenticación) ---
const { authMiddleware } = require("./middlewares/auth/AuthMiddleware");
app.post("/api/upload", authMiddleware, upload.single("imagen"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No se subió ninguna imagen." });
  }
  const url = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.json({ url });
});

// ...existing code...

// --- Nuevo bloque de código para las asociaciones de Sequelize ---
// 1. Importar todos los modelos que tienen asociaciones
const sequelize = require("./config/database");
const Product = require("./models/products/Product");
const Supplier = require("./models/supplier/SupplierModel");
const Purchase = require("./models/purchase/PurchaseModel");
const PurchaseDetail = require("./models/purchase/PurchaseDetailModel");
const User = require("./models/users/Users");
const LaborScheduling = require("./models/labor_scheduling/LaborSchedulingModel");
const ShiftTemplate = require("./models/labor_scheduling/ShiftTemplateModel");
const ShiftTimeSlot = require("./models/labor_scheduling/ShiftTimeSlotModel");
const ShiftInstance = require("./models/labor_scheduling/ShiftInstanceModel");
const EmployeeShiftAssignment = require("./models/labor_scheduling/EmployeeShiftAssignmentModel");
const Schedule = require("./models/labor_scheduling/ScheduleModel");
const UserScheduleAssignment = require("./models/labor_scheduling/UserScheduleAssignmentModel");

// 2. Ejecutar las funciones de asociación de cada modelo
function setupAssociations() {
  const models = {
    Product,
    Supplier,
    Purchase,
    PurchaseDetail,
    User,
    LaborScheduling,
    ShiftTemplate,
    ShiftTimeSlot,
    ShiftInstance,
    EmployeeShiftAssignment,
    Schedule,
    UserScheduleAssignment,
    // ... Agrega todos tus modelos aquí
  };

  Object.values(models).forEach((model) => {
    if (model.associate) {
      model.associate(models);
    }
  });
}
setupAssociations();
// --- Fin del bloque de código nuevo ---
// Importar asociaciones de autenticación

require("./models/auth/associations");
// Asociaciones de proyectos
require("./models/projects/associations");

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

// Rutas de privilegios
const privilegesRoutes = require("./routes/auth/PrivilegesRoutes");
app.use("/api/privileges", privilegesRoutes);

// Rutas de proyectos
const ProjectRoutes = require("./routes/projects/ProjectRoutes");
app.use("/api/projects", ProjectRoutes);
// Rutas anidadas de pagos por proyecto (REST)
const ProjectPaymentsRoutes = require("./routes/projects/ProjectPaymentsRoutes");
app.use("/api/projects", ProjectPaymentsRoutes);

// Rutas de proveedores (comentadas temporalmente)
const SupplierRoutes = require("./routes/supplier/SupplierRoutes");
app.use("/api/suppliers", SupplierRoutes);

//Ruta para compras
const PurchaseRoutes = require("./routes/purchase/PurchaseRoutes");
app.use("/api/purchases", PurchaseRoutes);

// Rutas para categorias de productos
const categoryRoutes = require("./routes/products_category/ProductsCategoryRoutes");
app.use("/api/productsCategory", categoryRoutes);

//Ruta para productos
const ProductRoutes = require("./routes/products/ProductsRoutes");
app.use("/api/products/products", ProductRoutes);
const ProductFeatureRoutes = require("./routes/products/FeatureRoutes");
app.use("/api/products/features", ProductFeatureRoutes);
const DatasheetRoutes = require("./routes/products/DatasheetRoutes");
app.use("/api/products/datasheets", DatasheetRoutes);

//Ruta para ventas
const SaleRoutes = require("./routes/products_sale/SaleRoutes");
app.use("/api/sales", SaleRoutes);
const SaleDetails = require("./routes/products_sale/SaleDetailsRoutes");
app.use("/api/sales/details", SaleDetails);

//Ruta para cotizaciones
const QuoteRoutes = require("./routes/quotes/QuotesRoutes");
app.use("/api/quotes", QuoteRoutes);
const QuoteDetailsRoutes = require("./routes/quotes/QuoteDetailsRoutes");
app.use("/api/quotes/details", QuoteDetailsRoutes);

// Rutas de usuarios
const UsersRoutes = require("./routes/users/UsersRoutes");
app.use("/api/users", UsersRoutes);
const ClientsRoutes = require("./routes/clients/ClientsRoutes");
app.use("/api/clients", ClientsRoutes);
const AddressClientsRoutes = require("./routes/clients/AddressClientsRoutes");
app.use("/api/address-clients", AddressClientsRoutes);
const LaborSchedulingRoutes = require("./routes/labor_scheduling/LaborSchedulingRoutes");
app.use("/api/labor-scheduling", LaborSchedulingRoutes);

//Rutas de Categoria de Servicio
const ServiceCategoryRoutes = require("./routes/service_categories/ServiceCategoryRoutes");
app.use("/api/service-categories", ServiceCategoryRoutes);

// Rutas para servicios
const ServicesRoutes = require("./routes/services/ServicesRoutes");
app.use("/api/services", ServicesRoutes);

// Rutas legacy de pagos y abonos (deprecated)
const PaymentsInstallmentsRoutes = require("./routes/payments_installments/payments_installmentsRoutes");
app.use("/api/payments-installments", PaymentsInstallmentsRoutes);

// Rutas para citas
const AppointmentsRoutes = require("./routes/appointments/AppointmentsRoutes");
app.use("/api/appointments", AppointmentsRoutes);
// Rutas de diagnóstico (SMTP y otros)
const DebugMailRoutes = require("./routes/debug/DebugMailRoutes");
app.use("/api/debug", DebugMailRoutes);

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
