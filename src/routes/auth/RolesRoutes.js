const express = require("express");
const router = express.Router();
const RolesController = require("../../controllers/auth/RolesController");
const {
  authenticateToken,
  requireAdmin,
} = require("../../middlewares/auth/auth_middleware");
const {
  // Roles
  createRoleValidation,
  updateRoleValidation,
  roleIdValidation,

  // Asignaciones
  assignPermissionValidation,
  removePermissionValidation,
  roleIdParamValidation,
  bulkAssignPermissionsValidation,

  // Estados de usuario
  createUserStateValidation,
  updateUserStateValidation,
  userStateIdValidation,
} = require("../../middlewares/auth/RolesValidations");

// ==================== RUTAS ESPECIALES (DEBEN IR AL PRINCIPIO) ====================

/**
 * @route   GET /api/roles/user-states
 * @desc    Obtener todos los estados de usuario
 * @access  Private (Admin only)
 */
router.get(
  "/user-states",
  authenticateToken,
  requireAdmin,
  RolesController.getAllUserStates
);

/**
 * @route   POST /api/roles/user-states
 * @desc    Crear un nuevo estado de usuario
 * @access  Private (Admin only)
 */
router.post(
  "/user-states",
  authenticateToken,
  requireAdmin,
  createUserStateValidation,
  RolesController.createUserState
);

/**
 * @route   GET /api/roles/roles-with-permissions
 * @desc    Obtener roles con sus permisos
 * @access  Private (Admin only)
 */
router.get(
  "/roles-with-permissions",
  authenticateToken,
  requireAdmin,
  RolesController.getRolesWithPermissions
);

/**
 * @route   GET /api/roles/permissions-summary
 * @desc    Obtener resumen de permisos
 * @access  Private (Admin only)
 */
router.get(
  "/permissions-summary",
  authenticateToken,
  requireAdmin,
  RolesController.getPermissionsSummary
);

// ==================== RUTAS DE ROLES ====================

/**
 * @route   POST /api/roles
 * @desc    Crear un nuevo rol
 * @access  Private (Admin only)
 */
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  createRoleValidation,
  RolesController.createRole
);

/**
 * @route   GET /api/roles
 * @desc    Obtener todos los roles
 * @access  Private (Admin only)
 */
router.get("/", authenticateToken, requireAdmin, RolesController.getAllRoles);

/**
 * @route   GET /api/roles/:id
 * @desc    Obtener un rol por ID
 * @access  Private (Admin only)
 */
router.get(
  "/:id",
  authenticateToken,
  requireAdmin,
  roleIdValidation,
  RolesController.getRoleById
);

/**
 * @route   PUT /api/roles/:id
 * @desc    Actualizar un rol
 * @access  Private (Admin only)
 */
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  roleIdValidation,
  updateRoleValidation,
  RolesController.updateRole
);

/**
 * @route   DELETE /api/roles/:id
 * @desc    Eliminar un rol
 * @access  Private (Admin only)
 */
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  roleIdValidation,
  RolesController.deleteRole
);

// ==================== RUTAS DE ASIGNACIONES DE PERMISOS ====================

/**
 * @route   POST /api/roles/:roleId/permissions
 * @desc    Asignar permiso a un rol
 * @access  Private (Admin only)
 */
router.post(
  "/:roleId/permissions",
  authenticateToken,
  requireAdmin,
  roleIdParamValidation,
  assignPermissionValidation,
  RolesController.assignPermissionToRole
);

/**
 * @route   DELETE /api/roles/:roleId/permissions
 * @desc    Remover permiso de un rol
 * @access  Private (Admin only)
 */
router.delete(
  "/:roleId/permissions",
  authenticateToken,
  requireAdmin,
  roleIdParamValidation,
  removePermissionValidation,
  RolesController.removePermissionFromRole
);

/**
 * @route   GET /api/roles/:roleId/permissions
 * @desc    Obtener permisos de un rol
 * @access  Private (Admin only)
 */
router.get(
  "/:roleId/permissions",
  authenticateToken,
  requireAdmin,
  roleIdParamValidation,
  RolesController.getRolePermissions
);

/**
 * @route   POST /api/roles/:roleId/permissions/bulk
 * @desc    Asignar múltiples permisos a un rol
 * @access  Private (Admin only)
 */
router.post(
  "/:roleId/permissions/bulk",
  authenticateToken,
  requireAdmin,
  roleIdParamValidation,
  bulkAssignPermissionsValidation,
  RolesController.bulkAssignPermissions
);

module.exports = router;
