const express = require("express");
const router = express.Router();

const appointmentController = require("../../controllers/appointments/AppointmentsController");
const {
  validateAppointment,
} = require("../../middlewares/appointments/AppointmentMiddlware");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Rutas
router.get("/", permissionMiddleware("Citas", "Ver"), (req, res) => appointmentController.getAll(req, res));
router.get("/:id", permissionMiddleware("Citas", "Ver"), (req, res) => appointmentController.getById(req, res));
router.post("/", permissionMiddleware("Citas", "Crear"), validateAppointment, (req, res) =>
  appointmentController.create(req, res)
);
router.put("/:id", permissionMiddleware("Citas", "Editar"), validateAppointment, (req, res) =>
  appointmentController.update(req, res)
);
router.delete("/:id", permissionMiddleware("Citas", "Eliminar"), (req, res) => appointmentController.delete(req, res));

module.exports = router;
