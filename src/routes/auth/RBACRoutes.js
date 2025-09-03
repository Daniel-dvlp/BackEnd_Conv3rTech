const express = require("express");
const router = express.Router();
const RBACController = require("../../controllers/auth/RBACController");
const { authenticateToken } = require("../../middlewares/auth/auth_middleware");
const { checkPermission } = require("../../middlewares/auth/checkPermission");

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// Rutas para permisos del usuario autenticado
router.get("/my-permissions", RBACController.getMyPermissions);

// Rutas para gestión de roles y permisos (requieren permisos de administración)
router.get(
  "/roles-with-permissions",
  checkPermission("Roles", "Leer"),
  RBACController.getAllRolesWithPermissions
);

router.post(
  "/roles/:roleId/permissions",
  checkPermission("Roles", "Actualizar"),
  RBACController.assignPermissionsToRole
);

router.get(
  "/available-permissions",
  checkPermission("Roles", "Leer"),
  RBACController.getAvailablePermissions
);

// Rutas para gestión de permisos y privilegios
router.post(
  "/permissions",
  checkPermission("Roles", "Crear"),
  RBACController.createPermission
);

router.post(
  "/privileges",
  checkPermission("Roles", "Crear"),
  RBACController.createPrivilege
);

// Rutas para estadísticas y reportes
router.get(
  "/stats",
  checkPermission("Reportes", "Leer"),
  RBACController.getRBACStats
);

router.get(
  "/roles/:roleId/users",
  checkPermission("Usuarios", "Leer"),
  RBACController.getUsersByRole
);

// Rutas para verificación de permisos
router.get(
  "/users/:userId/permissions",
  checkPermission("Usuarios", "Leer"),
  RBACController.getUserPermissions
);

router.get(
  "/users/:userId/check-permission",
  checkPermission("Usuarios", "Leer"),
  RBACController.checkUserPermission
);

module.exports = router;
