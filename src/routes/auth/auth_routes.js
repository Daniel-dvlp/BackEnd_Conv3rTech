const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/auth_controller');
const { authenticateToken } = require('../../middlewares/auth/auth_middleware');
const { loginValidation, checkPermissionValidation } = require('../../middlewares/auth/auth_validations');

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuario
 * @access  Public
 */
router.post('/login', loginValidation, authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Obtener información del usuario actual
 * @access  Private
 */
router.get('/me', authenticateToken, authController.getCurrentUser);

/**
 * @route   GET /api/auth/permissions
 * @desc    Obtener permisos del usuario actual
 * @access  Private
 */
router.get('/permissions', authenticateToken, authController.getUserPermissions);

/**
 * @route   POST /api/auth/check-permission
 * @desc    Verificar si el usuario tiene un permiso específico
 * @access  Private
 */
router.post('/check-permission', authenticateToken, checkPermissionValidation, authController.checkPermission);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout de usuario
 * @access  Private
 */
router.post('/logout', authenticateToken, authController.logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Renovar token
 * @access  Private
 */
router.post('/refresh', authenticateToken, authController.refreshToken);

module.exports = router;
