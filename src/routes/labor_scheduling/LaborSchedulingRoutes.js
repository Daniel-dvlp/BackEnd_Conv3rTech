const express = require("express");
const router = express.Router();
const LaborSchedulingController = require("../../controllers/labor_scheduling/LaborSchedulingController");
const {
    validateCreateRecurringSchedule,
    validateCreateOneTimeEvent,
    validateAssignScheduleToUsers,
    validateUpdateSchedule,
} = require("../../middlewares/labor_scheduling/LaborSchedulingMiddleware");
const { authMiddleware, permissionMiddleware } = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// GET /api/labor-scheduling?tipo=&userId=&from=&to=&includeInactive=
// Obtener todos los horarios con asignaciones
router.get("/", permissionMiddleware("Programación laboral", "Ver"), LaborSchedulingController.getAllSchedules);

// GET /api/labor-scheduling/:scheduleId
// Obtener un horario por ID
router.get("/:scheduleId", permissionMiddleware("Programación laboral", "Ver"), LaborSchedulingController.getScheduleById);

// POST /api/labor-scheduling/recurring
// Crear un horario recurrente
router.post("/recurring", permissionMiddleware("Programación laboral", "Crear"), validateCreateRecurringSchedule, LaborSchedulingController.createRecurringSchedule);

// POST /api/labor-scheduling/one-time
// Crear un evento único
router.post("/one-time", permissionMiddleware("Programación laboral", "Crear"), validateCreateOneTimeEvent, LaborSchedulingController.createOneTimeEvent);

// POST /api/labor-scheduling/:scheduleId/assign
// Asignar un horario a usuarios
router.post("/:scheduleId/assign", permissionMiddleware("Programación laboral", "Editar"), validateAssignScheduleToUsers, LaborSchedulingController.assignScheduleToUsers);

// PUT /api/labor-scheduling/:scheduleId
// Actualizar un horario
router.put("/:scheduleId", permissionMiddleware("Programación laboral", "Editar"), validateUpdateSchedule, LaborSchedulingController.updateSchedule);

// DELETE /api/labor-scheduling/:scheduleId
// Eliminar un horario
router.delete("/:scheduleId", permissionMiddleware("Programación laboral", "Eliminar"), LaborSchedulingController.deleteSchedule);

module.exports = router;
