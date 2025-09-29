const express = require("express");
const router = express.Router();
const RoleController = require("../../controllers/auth/RoleController");
const {
  authMiddleware: authenticateToken,
  adminMiddleware: requireAdmin,
} = require("../../middlewares/auth/AuthMiddleware");
const {
  // Privilegios
  createPrivilegeValidation,
  updatePrivilegeValidation,
  privilegeIdValidation,
} = require("../../middlewares/auth/AuthValidations");

// ==================== RUTAS DE PRIVILEGIOS ====================

/**
 * @route   POST /api/privileges
 * @desc    Crear un nuevo privilegio
 * @access  Private (Admin only)
 */
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  createPrivilegeValidation,
  RoleController.createPrivilege
);

/**
 * @route   GET /api/privileges
 * @desc    Obtener todos los privilegios
 * @access  Private (Admin only)
 */
router.get(
  "/",
  authenticateToken,
  requireAdmin,
  RoleController.getAllPrivileges
);

/**
 * @route   GET /api/privileges/:id
 * @desc    Obtener un privilegio por ID
 * @access  Private (Admin only)
 */
router.get(
  "/:id",
  authenticateToken,
  requireAdmin,
  privilegeIdValidation,
  RoleController.getPrivilegeById
);

/**
 * @route   PUT /api/privileges/:id
 * @desc    Actualizar un privilegio
 * @access  Private (Admin only)
 */
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  privilegeIdValidation,
  updatePrivilegeValidation,
  RoleController.updatePrivilege
);

/**
 * @route   DELETE /api/privileges/:id
 * @desc    Eliminar un privilegio
 * @access  Private (Admin only)
 */
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  privilegeIdValidation,
  RoleController.deletePrivilege
);

module.exports = router;
