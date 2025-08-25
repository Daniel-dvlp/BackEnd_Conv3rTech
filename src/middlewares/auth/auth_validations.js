const { body } = require('express-validator');

/**
 * Validaciones para el login
 */
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('El email debe tener un formato válido')
    .normalizeEmail()
    .trim(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .trim()
];

/**
 * Validaciones para verificar permisos
 */
const checkPermissionValidation = [
  body('module')
    .notEmpty()
    .withMessage('El módulo es requerido')
    .isString()
    .withMessage('El módulo debe ser una cadena de texto')
    .trim(),
  
  body('privilege')
    .notEmpty()
    .withMessage('El privilegio es requerido')
    .isIn(['crear', 'leer', 'actualizar', 'eliminar'])
    .withMessage('El privilegio debe ser: crear, leer, actualizar o eliminar')
    .trim()
];

module.exports = {
  loginValidation,
  checkPermissionValidation
};
