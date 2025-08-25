const express = require('express');
const router = express.Router();
const ProjectController = require('../../controllers/projects/ProjectController');
const ProjectValidations = require('../../middlewares/projects/ProjectValidations');
const { authenticateToken } = require('../../middlewares/auth/auth_middleware');

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// Rutas principales de proyectos
router.get('/', ProjectValidations.searchProjectsValidation, ProjectController.getAllProjects);
router.get('/stats', ProjectController.getProjectStats);
router.get('/export', ProjectController.exportProjects);

// Rutas CRUD de proyectos
router.post('/', ProjectValidations.createProjectValidation, ProjectController.createProject);
router.get('/:id', ProjectValidations.getProjectByIdValidation, ProjectController.getProjectById);
router.put('/:id', ProjectValidations.updateProjectValidation, ProjectController.updateProject);
router.delete('/:id', ProjectValidations.deleteProjectValidation, ProjectController.deleteProject);

// Rutas específicas de proyectos
router.get('/client/:clientId', ProjectController.getProjectsByClient);
router.get('/responsible/:responsibleId', ProjectController.getProjectsByResponsible);

// Rutas para actualizar estados específicos
router.patch('/:id/progress', ProjectValidations.updateProgressValidation, ProjectController.updateProjectProgress);
router.patch('/:id/status', ProjectValidations.updateStatusValidation, ProjectController.updateProjectStatus);

// Rutas para salidas de material
router.post('/salida-material', ProjectValidations.createSalidaMaterialValidation, ProjectController.createSalidaMaterial);
router.get('/:idProyecto/salidas-material', ProjectValidations.getSalidasMaterialValidation, ProjectController.getSalidasMaterial);

module.exports = router;
