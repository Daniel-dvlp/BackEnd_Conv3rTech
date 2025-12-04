const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware de logging global
app.use((req, res, next) => {
  console.error(`[Global] ${req.method} ${req.url}`);
  next();
});

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
  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename
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

// 2. Ejecutar las funciones de asociación de cada modelo
require("./models/labor_scheduling/associations");
require("./models/appointments/associations");
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
const ProductFeatureRoutes = require("./routes/products/FeatureRoutes");
app.use("/api/products/features", ProductFeatureRoutes);
const DatasheetRoutes = require("./routes/products/DatasheetRoutes");
app.use("/api/products/datasheets", DatasheetRoutes);
const ProductRoutes = require("./routes/products/ProductsRoutes");
app.use("/api/products", ProductRoutes);

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
// Mapeo de rutas antiguas para compatibilidad o archivos faltantes
// const ProgramacionesRoutes = require("./routes/labor_scheduling/ProgramacionesRoutes");
app.use("/api/programaciones", LaborSchedulingRoutes); // Usando LaborSchedulingRoutes como reemplazo temporal
// const NovedadesRoutes = require("./routes/labor_scheduling/NovedadesRoutes");
// app.use("/api/novedades", NovedadesRoutes);
// const EventsRoutes = require("./routes/labor_scheduling/EventsRoutes");
const Programacion = require("./models/labor_scheduling/ProgramacionModel");
const Novedad = require("./models/labor_scheduling/NovedadModel");
app.get("/api/events", authMiddleware, async (req, res) => {
  try {
    const { Op } = require("sequelize");
    const rangeStart = req.query.rangeStart;
    const rangeEnd = req.query.rangeEnd;
    const usuarioIds = (req.query.usuarioIds || "")
      .split(",")
      .map((v) => Number(v))
      .filter((v) => !Number.isNaN(v));
    
    const User = require("./models/users/Users");
    const includeUser = { model: User, as: "usuario" };
    
    const where = {};
    if (usuarioIds.length) where.usuario_id = usuarioIds;
    
    // Fetch Programaciones
    const items = await Programacion.findAll({ include: [includeUser], where });
    
    // Fetch Novedades (filtradas por rango si está presente)
    const novedadesWhere = { ...where };
    if (rangeStart && rangeEnd) {
      const from = rangeStart;
      const to = rangeEnd;
      Object.assign(novedadesWhere, {
        [Op.or]: [
          { fecha_inicio: { [Op.between]: [from, to] } },
          { fecha_fin: { [Op.between]: [from, to] } },
          { fecha_inicio: { [Op.lte]: from }, fecha_fin: { [Op.gte]: to } },
        ],
      });
    }
    const novedades = await Novedad.findAll({ include: [includeUser], where: novedadesWhere });

    const startDate = rangeStart ? new Date(rangeStart) : null;
    const endDate = rangeEnd ? new Date(rangeEnd) : null;
    const result = [];
    const dayMap = {
      0: "domingo",
      1: "lunes",
      2: "martes",
      3: "miercoles",
      4: "jueves",
      5: "viernes",
      6: "sabado",
    };
    function formatTime(dateStr, time) {
      return `${dateStr}T${time.length === 5 ? time : (time || "00:00")}:00`;
    }
    function iterateDates(from, to, cb) {
      if (!from || !to) return;
      const d = new Date(from);
      while (d <= to) {
        cb(new Date(d));
        d.setDate(d.getDate() + 1);
      }
    }
    
    // Logging de conteo
    console.log(
      `[Events] usuarioIds=${usuarioIds.join(',') || 'ALL'} range=${rangeStart || '-'}..${rangeEnd || '-'} ` +
      `programaciones=${items.length} novedades=${novedades.length}`
    );

    // Process Programaciones
    iterateDates(startDate, endDate, (date) => {
      const dateStr = date.toISOString().split("T")[0];
      const dayLabel = dayMap[date.getDay()];
      items.forEach((s) => {
        const slots = (s.dias || {})[dayLabel] || [];
        slots.forEach((slot, idx) => {
          const color = slot.color || s.color || "#2563EB";
          result.push({
            id: `prog-${s.id_programacion}-${dateStr}-${idx}`,
            title: slot.subtitulo || s.titulo,
            start: formatTime(dateStr, slot.horaInicio),
            end: formatTime(dateStr, slot.horaFin),
            allDay: false,
            backgroundColor: color,
            borderColor: color,
            extendedProps: {
              type: "programacion",
              meta: {
                programacionId: s.id_programacion,
                usuarioId: s.usuario_id,
                usuario: s.usuario,
                descripcion: s.descripcion,
              },
            },
          });
        });
      });
    });

    // Process Novedades
    novedades.forEach((n) => {
        // Basic date filtering
        const nStart = new Date(n.fecha_inicio);
        const nEnd = n.fecha_fin ? new Date(n.fecha_fin) : new Date(n.fecha_inicio);
        
        // Check overlap with requested range if provided
        if (startDate && endDate) {
             if (nEnd < startDate || nStart > endDate) return;
        }

        result.push({
            id: `nov-${n.id_novedad}`,
            title: n.titulo,
            start: n.all_day ? n.fecha_inicio : formatTime(n.fecha_inicio, n.hora_inicio),
            end: n.all_day ? (n.fecha_fin ? n.fecha_fin : n.fecha_inicio) : formatTime(n.fecha_fin || n.fecha_inicio, n.hora_fin),
            allDay: n.all_day,
            backgroundColor: n.color,
            borderColor: n.color,
            extendedProps: {
                type: "novedad",
                meta: {
                    novedadId: n.id_novedad,
                    usuarioId: n.usuario_id,
                    usuario: n.usuario,
                    descripcion: n.descripcion
                }
            }
        });
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

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

// Endpoint de prueba de conexión a BD (SOLO PARA DEBUG)
// const sequelize = require("./config/database"); // YA IMPORTADO ARRIBA
app.get("/api/test-db-connection", async (req, res) => {
  try {
    await sequelize.authenticate();
    // Intentar una consulta simple
    const [results] = await sequelize.query("SELECT 1+1 AS result");
    
    res.json({
      success: true,
      message: "Conexión a BD exitosa desde este entorno",
      db_host: process.env.DB_HOST, // Ocultar en prod real, útil aquí para verificar
      query_result: results[0],
      env: process.env.NODE_ENV
    });
  } catch (error) {
    console.error("DB Connection Error:", error);
    res.status(500).json({
      success: false,
      message: "Error conectando a la BD",
      error: error.message,
      config_host: process.env.DB_HOST // Para verificar qué host está usando Render
    });
  }
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
