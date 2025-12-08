const express = require("express");
const router = express.Router();

const serviceController = require("../../controllers/services/ServiceController"); // <-- RUTA CORREGIDA
const {
  createServiceValidation,
  updateServiceValidation,
  serviceIdValidation,
} = require("../../middlewares/services/ServicesMiddleware");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// LISTAR TODOS
router.get("/", permissionMiddleware("Servicios", "Ver"), serviceController.getAllServices);

// LISTAR POR ID
router.get("/:id", permissionMiddleware("Servicios", "Ver"), serviceIdValidation, serviceController.getServiceById);

// CREAR
router.post("/", permissionMiddleware("Servicios", "Crear"), createServiceValidation, serviceController.createService);

// ACTUALIZAR
router.put("/:id", permissionMiddleware("Servicios", "Editar"), updateServiceValidation, serviceController.updateService);

// ELIMINAR
router.delete("/:id", permissionMiddleware("Servicios", "Eliminar"), serviceIdValidation, serviceController.deleteService);

module.exports = router;
