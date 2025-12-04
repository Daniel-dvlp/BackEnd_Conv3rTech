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
const Users = require("../../models/users/Users");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// GET /api/labor-scheduling?tipo=&userId=&from=&to=&includeInactive=
// Obtener todos los horarios con asignaciones
router.get("/", /* permissionMiddleware("Programación laboral", "Ver"), */ LaborSchedulingController.getAllSchedules);

// GET /api/labor-scheduling/:scheduleId
// Obtener un horario por ID
router.get("/usuarios-disponibles", /* permissionMiddleware("Programación laboral", "Ver"), */ async (req, res) => {
  try {
    const users = await Users.findAll({ attributes: ["id_usuario", "nombre", "apellido", "documento"], where: { estado_usuario: "Activo" } });
    const data = users.map((u) => ({ id: u.id_usuario, nombre: u.nombre, apellido: u.apellido, documento: u.documento }));
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/novedades", /* permissionMiddleware("Programación laboral", "Ver"), */ LaborSchedulingController.getNovedades);
router.get("/novedades/:id(\\d+)", /* permissionMiddleware("Programación laboral", "Ver"), */ LaborSchedulingController.getNovedadById);
router.post("/novedades", /* permissionMiddleware("Programación laboral", "Crear"), */ LaborSchedulingController.createNovedad);
router.put("/novedades/:id(\\d+)", /* permissionMiddleware("Programación laboral", "Editar"), */ LaborSchedulingController.updateNovedad);
router.delete("/novedades/:id(\\d+)", /* permissionMiddleware("Programación laboral", "Eliminar"), */ LaborSchedulingController.deleteNovedad);

router.get("/:scheduleId(\\d+)", /* permissionMiddleware("Programación laboral", "Ver"), */ LaborSchedulingController.getScheduleById);

// POST /api/labor-scheduling/recurring
// Crear un horario recurrente
router.post("/recurring", /* permissionMiddleware("Programación laboral", "Crear"), */ validateCreateRecurringSchedule, LaborSchedulingController.createRecurringSchedule);

router.post("/", /* permissionMiddleware("Programación laboral", "Crear"), */ validateCreateRecurringSchedule, LaborSchedulingController.createRecurringSchedule);

// POST /api/labor-scheduling/one-time
// Crear un evento único
router.post("/one-time", /* permissionMiddleware("Programación laboral", "Crear"), */ validateCreateOneTimeEvent, LaborSchedulingController.createOneTimeEvent);

// POST /api/labor-scheduling/:scheduleId/assign
// Asignar un horario a usuarios
router.post("/:scheduleId(\\d+)/assign", /* permissionMiddleware("Programación laboral", "Editar"), */ validateAssignScheduleToUsers, LaborSchedulingController.assignScheduleToUsers);

// PUT /api/labor-scheduling/:scheduleId
// Actualizar un horario
router.put("/:scheduleId(\\d+)", /* permissionMiddleware("Programación laboral", "Editar"), */ validateUpdateSchedule, LaborSchedulingController.updateSchedule);

// DELETE /api/labor-scheduling/:scheduleId
// Eliminar un horario
router.delete("/:scheduleId(\\d+)", /* permissionMiddleware("Programación laboral", "Eliminar"), */ LaborSchedulingController.deleteSchedule);


module.exports = router;
