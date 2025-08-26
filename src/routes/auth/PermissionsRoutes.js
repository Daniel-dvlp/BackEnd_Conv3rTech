const express = require('express');
const router = express.Router();
const RolesController = require('../../controllers/auth/RolesController');
const { authenticateToken, requireAdmin } = require('../../middlewares/auth/auth_middleware');
const {
    // Permisos
    createPermissionValidation,
    updatePermissionValidation,
    permissionIdValidation,
    
    // Privilegios
    createPrivilegeValidation,
    updatePrivilegeValidation,
    privilegeIdValidation
} = require('../../middlewares/auth/RolesValidations');

// ==================== RUTAS DE PERMISOS ====================

/**
 * @route   POST /api/permissions
 * @desc    Crear un nuevo permiso
 * @access  Private (Admin only)
 */
router.post('/', 
    authenticateToken, 
    requireAdmin, 
    createPermissionValidation, 
    RolesController.createPermission
);

/**
 * @route   GET /api/permissions
 * @desc    Obtener todos los permisos
 * @access  Private (Admin only)
 */
router.get('/', 
    authenticateToken, 
    requireAdmin, 
    RolesController.getAllPermissions
);

/**
 * @route   GET /api/permissions/:id
 * @desc    Obtener un permiso por ID
 * @access  Private (Admin only)
 */
router.get('/:id', 
    authenticateToken, 
    requireAdmin, 
    permissionIdValidation, 
    RolesController.getPermissionById
);

/**
 * @route   PUT /api/permissions/:id
 * @desc    Actualizar un permiso
 * @access  Private (Admin only)
 */
router.put('/:id', 
    authenticateToken, 
    requireAdmin, 
    permissionIdValidation,
    updatePermissionValidation, 
    RolesController.updatePermission
);

/**
 * @route   DELETE /api/permissions/:id
 * @desc    Eliminar un permiso
 * @access  Private (Admin only)
 */
router.delete('/:id', 
    authenticateToken, 
    requireAdmin, 
    permissionIdValidation, 
    RolesController.deletePermission
);

module.exports = router;
