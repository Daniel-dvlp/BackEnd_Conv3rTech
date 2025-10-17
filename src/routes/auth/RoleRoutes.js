const express = require("express");
const router = express.Router();
const RoleController = require("../../controllers/auth/RoleController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../../middlewares/auth/AuthMiddleware");
const {
  createRoleValidation,
  updateRoleValidation,
  idValidation,
  assignPermissionsValidation,
  assignPermissionsFlexibleValidation,
} = require("../../middlewares/auth/AuthValidations");

// Todas las rutas requieren autenticación y ser administrador
router.use(authMiddleware);
router.use(adminMiddleware);

// CRUD de roles
router.get("/", RoleController.getAllRoles);
router.get("/:id", idValidation, RoleController.getRoleById);
router.post("/", createRoleValidation, RoleController.createRole);
router.put(
  "/:id",
  idValidation,
  updateRoleValidation,
  RoleController.updateRole
);
router.delete("/:id", idValidation, RoleController.deleteRole);

// Gestión de permisos de roles
router.post(
  "/:id/permissions",
  idValidation,
  assignPermissionsFlexibleValidation,
  RoleController.assignPermissionsToRole
);
router.get("/:id/permissions", idValidation, RoleController.getRolePermissions);

// Obtener permisos y privilegios disponibles
router.get("/permissions/available", RoleController.getAllPermissions);
router.get("/privileges/available", RoleController.getAllPrivileges);

module.exports = router;
