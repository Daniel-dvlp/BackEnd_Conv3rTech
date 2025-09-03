const express = require("express");
const router = express.Router();
const RoleController = require("../../controllers/auth/RoleController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../../middlewares/auth/AuthMiddleware");
const {
  // Permisos
  createPermissionValidation,
  updatePermissionValidation,
  permissionIdValidation,

  // Privilegios
  createPrivilegeValidation,
  updatePrivilegeValidation,
  privilegeIdValidation,
} = require("../../middlewares/auth/AuthValidations");

// ==================== RUTAS DE PERMISOS ====================

/**
 * @route   POST /api/permissions
 * @desc    Crear un nuevo permiso
 * @access  Private (Admin only)
 */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createPermissionValidation,
  RoleController.createPermission
);

/**
 * @route   GET /api/permissions
 * @desc    Obtener todos los permisos
 * @access  Private (Admin only)
 */
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  RoleController.getAllPermissions
);

/**
 * @route   GET /api/permissions/:id
 * @desc    Obtener un permiso por ID
 * @access  Private (Admin only)
 */
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  permissionIdValidation,
  RoleController.getPermissionById
);

/**
 * @route   PUT /api/permissions/:id
 * @desc    Actualizar un permiso
 * @access  Private (Admin only)
 */
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  permissionIdValidation,
  updatePermissionValidation,
  RoleController.updatePermission
);

/**
 * @route   DELETE /api/permissions/:id
 * @desc    Eliminar un permiso
 * @access  Private (Admin only)
 */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  permissionIdValidation,
  RoleController.deletePermission
);

module.exports = router;
