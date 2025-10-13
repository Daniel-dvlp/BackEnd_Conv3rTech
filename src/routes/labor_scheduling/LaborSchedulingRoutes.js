const express = require("express");
const router = express.Router();
const LaborSchedulingController = require("../../controllers/labor_scheduling/LaborSchedulingController");
const {
  validateCreateScheduling,
} = require("../../middlewares/labor_scheduling/LaborSchedulingMiddleware");
const { authMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Crear una nueva programación laboral con validación
router.post(
  "/",
  validateCreateScheduling,
  LaborSchedulingController.createScheduling
);

// Obtener todas las programaciones laborales
router.get("/", LaborSchedulingController.getAllSchedulings);

// Obtener una programación laboral por ID
router.get("/:id", LaborSchedulingController.getSchedulingById);

// Actualizar una programación laboral
router.put("/:id", LaborSchedulingController.updateScheduling);

// Eliminar una programación laboral
router.delete("/:id", LaborSchedulingController.deleteScheduling);

module.exports = router;
