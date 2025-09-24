const express = require("express");
const router = express.Router();
const ProjectController = require("../../controllers/projects/ProjectController");
const ProjectValidations = require("../../middlewares/projects/ProjectValidations");
// Usar el middleware de autenticación existente
const {
  authMiddleware: authenticateToken,
} = require("../../middlewares/auth/AuthMiddleware");

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// Rutas principales de proyectos
router.get(
  "/",
  ProjectValidations.searchProjectsValidation,
  ProjectController.getAllProjects
);
// Búsqueda rápida para seleccionar proyecto (por número de contrato, nombre, cliente)
router.get(
  "/search",
  ProjectValidations.quickSearchProjectsValidation,
  ProjectController.quickSearchProjects
);
router.get("/stats", ProjectController.getProjectStats);
router.get("/export", ProjectController.exportProjects);

// Rutas CRUD de proyectos
router.post(
  "/",
  ProjectValidations.createProjectValidation,
  ProjectController.createProject
);
router.get(
  "/:id",
  ProjectValidations.getProjectByIdValidation,
  ProjectController.getProjectById
);
// Saldo pendiente del proyecto (totales y pendiente)
router.get(
  "/:id/outstanding",
  ProjectValidations.getProjectByIdValidation,
  ProjectController.getProjectOutstanding
);
router.put(
  "/:id",
  ProjectValidations.updateProjectValidation,
  ProjectController.updateProject
);
router.delete(
  "/:id",
  ProjectValidations.deleteProjectValidation,
  ProjectController.deleteProject
);

// Rutas específicas de proyectos
router.get("/client/:clientId", ProjectController.getProjectsByClient);
router.get(
  "/responsible/:responsibleId",
  ProjectController.getProjectsByResponsible
);

// Rutas para actualizar estados específicos
router.patch(
  "/:id/progress",
  ProjectValidations.updateProgressValidation,
  ProjectController.updateProjectProgress
);
router.patch(
  "/:id/status",
  ProjectValidations.updateStatusValidation,
  ProjectController.updateProjectStatus
);

// Rutas para salidas de material
router.post(
  "/salida-material",
  ProjectValidations.createSalidaMaterialValidation,
  ProjectController.createSalidaMaterial
);
router.get(
  "/:idProyecto/salidas-material",
  ProjectValidations.getSalidasMaterialValidation,
  ProjectController.getSalidasMaterial
);

// Rutas para gestión de servicios
router.patch(
  "/servicios/:idSedeServicio/completar",
  ProjectController.markServiceAsCompleted
);
router.patch(
  "/servicios/:idSedeServicio/pendiente",
  ProjectController.markServiceAsPending
);

module.exports = router;
