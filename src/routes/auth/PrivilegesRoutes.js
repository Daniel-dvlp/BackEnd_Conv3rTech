const express = require("express");
const router = express.Router();
const RolesController = require("../../controllers/auth/RoleController");
const {
  authenticateToken,
  requireAdmin,
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
  RolesController.createPrivilege
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
  RolesController.getAllPrivileges
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
  RolesController.getPrivilegeById
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
  RolesController.updatePrivilege
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
  RolesController.deletePrivilege
);

module.exports = router;
