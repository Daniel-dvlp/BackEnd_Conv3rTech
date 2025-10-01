const express = require("express");
const router = express.Router();

const appointmentController = require("../../controllers/appointments/AppointmentsController");
const {
  validateAppointment,
} = require("../../middlewares/appointments/AppointmentMiddlware");
const { authMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Rutas
router.get("/", (req, res) => appointmentController.getAll(req, res));
router.get("/:id", (req, res) => appointmentController.getById(req, res));
router.post("/", validateAppointment, (req, res) =>
  appointmentController.create(req, res)
);
router.put("/:id", validateAppointment, (req, res) =>
  appointmentController.update(req, res)
);
router.delete("/:id", (req, res) => appointmentController.delete(req, res));

module.exports = router;
