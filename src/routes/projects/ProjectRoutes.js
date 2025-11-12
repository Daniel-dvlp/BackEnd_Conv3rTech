const express = require("express");
const router = express.Router();
const ProjectController = require("../../controllers/projects/ProjectController");
const ProjectValidations = require("../../middlewares/projects/ProjectValidations");
// Usar el middleware de autenticación existente
const {
  authMiddleware: authenticateToken,
  permissionMiddleware,
} = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// Rutas principales de proyectos
router.get(
  "/",
  permissionMiddleware("Proyectos", "Leer"),
  ProjectValidations.searchProjectsValidation,
  ProjectController.getAllProjects
);
// Búsqueda rápida para seleccionar proyecto (por número de contrato, nombre, cliente)
router.get(
  "/search",
  permissionMiddleware("Proyectos", "Leer"),
  ProjectValidations.quickSearchProjectsValidation,
  ProjectController.quickSearchProjects
);
router.get(
  "/stats",
  permissionMiddleware("Proyectos", "Leer"),
  ProjectController.getProjectStats
);
router.get(
  "/export",
  permissionMiddleware("Proyectos", "Leer"),
  ProjectController.exportProjects
);

// Rutas CRUD de proyectos
router.post(
  "/",
  permissionMiddleware("Proyectos", "Crear"),
  ProjectValidations.createProjectValidation,
  ProjectController.createProject
);
router.get(
  "/:id",
  permissionMiddleware("Proyectos", "Leer"),
  ProjectValidations.getProjectByIdValidation,
  ProjectController.getProjectById
);
// Saldo pendiente del proyecto (totales y pendiente)
router.get(
  "/:id/outstanding",
  permissionMiddleware("Proyectos", "Leer"),
  ProjectValidations.getProjectByIdValidation,
  ProjectController.getProjectOutstanding
);
router.put(
  "/:id",
  permissionMiddleware("Proyectos", "Editar"),
  ProjectValidations.updateProjectValidation,
  ProjectController.updateProject
);
router.delete(
  "/:id",
  permissionMiddleware("Proyectos", "Eliminar"),
  ProjectValidations.deleteProjectValidation,
  ProjectController.deleteProject
);

// Rutas específicas de proyectos
router.get(
  "/client/:clientId",
  permissionMiddleware("Proyectos", "Leer"),
  ProjectController.getProjectsByClient
);
router.get(
  "/responsible/:responsibleId",
  permissionMiddleware("Proyectos", "Leer"),
  ProjectController.getProjectsByResponsible
);

// Rutas para actualizar estados específicos
router.patch(
  "/:id/progress",
  permissionMiddleware("Proyectos", "Editar"),
  ProjectValidations.updateProgressValidation,
  ProjectController.updateProjectProgress
);
router.patch(
  "/:id/status",
  permissionMiddleware("Proyectos", "Editar"),
  ProjectValidations.updateStatusValidation,
  ProjectController.updateProjectStatus
);

// Rutas para salidas de material
router.post(
  "/salida-material",
  permissionMiddleware("Proyectos", "Editar"),
  ProjectValidations.createSalidaMaterialValidation,
  ProjectController.createSalidaMaterial
);
router.get(
  "/:idProyecto/salidas-material",
  permissionMiddleware("Proyectos", "Leer"),
  ProjectValidations.getSalidasMaterialValidation,
  ProjectController.getSalidasMaterial
);

// Rutas para gestión de servicios
router.patch(
  "/servicios/:idSedeServicio/completar",
  permissionMiddleware("Proyectos", "Editar"),
  ProjectController.markServiceAsCompleted
);
router.patch(
  "/servicios/:idSedeServicio/pendiente",
  permissionMiddleware("Proyectos", "Editar"),
  ProjectController.markServiceAsPending
);

module.exports = router;
