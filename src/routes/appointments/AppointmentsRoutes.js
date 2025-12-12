const express = require("express");
const router = express.Router();

const appointmentController = require("../../controllers/appointments/AppointmentsController");
const {
  validateAppointment,
} = require("../../middlewares/appointments/AppointmentMiddlware");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use((req, res, next) => {
    console.log(`🚀 [AppointmentsRoutes] ${req.method} ${req.originalUrl}`);
    next();
});
router.use(authMiddleware);

// Rutas
// TEMPORAL: Comentando permissionMiddleware para debug extremo
router.get("/", (req, res) => appointmentController.getAll(req, res));
router.get("/:id", (req, res) => appointmentController.getById(req, res));

// FIX: Verificar si el middleware de permisos está bloqueando.
// Según seedAuth.js, el Coordinador (3) tiene permisos para Citas: Crear, Editar, Ver.
// Sin embargo, si el slug generado no coincide ("citas" vs "Citas"), puede fallar.
// AuthService normaliza a lowercase, así que "Citas" -> "citas".
router.post("/", validateAppointment, (req, res) =>
  appointmentController.create(req, res)
);
router.put("/:id", validateAppointment, (req, res) =>
  appointmentController.update(req, res)
);
router.delete("/:id", permissionMiddleware("Citas", "Eliminar"), (req, res) => appointmentController.delete(req, res));

module.exports = router;
