const { body, param } = require('express-validator');

// ==================== VALIDACIONES DE ROLES ====================

const createRoleValidation = [
    body('nombre_rol')
        .notEmpty()
        .withMessage('El nombre del rol es obligatorio')
        .isLength({ min: 3, max: 60 })
        .withMessage('El nombre del rol debe tener entre 3 y 60 caracteres')
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
        .withMessage('El nombre del rol solo puede contener letras y espacios'),
    
    body('descripcion')
        .notEmpty()
        .withMessage('La descripción del rol es obligatoria')
        .isLength({ min: 10, max: 500 })
        .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
    
    body('estado')
        .optional()
        .isBoolean()
        .withMessage('El estado debe ser un valor booleano')
];

const updateRoleValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID del rol debe ser un número entero positivo'),
    
    body('nombre_rol')
        .optional()
        .isLength({ min: 3, max: 60 })
        .withMessage('El nombre del rol debe tener entre 3 y 60 caracteres')
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
        .withMessage('El nombre del rol solo puede contener letras y espacios'),
    
    body('descripcion')
        .optional()
        .isLength({ min: 10, max: 500 })
        .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
    
    body('estado')
        .optional()
        .isBoolean()
        .withMessage('El estado debe ser un valor booleano')
];

const roleIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID del rol debe ser un número entero positivo')
];

// ==================== VALIDACIONES DE PERMISOS ====================

const createPermissionValidation = [
    body('nombre_permiso')
        .notEmpty()
        .withMessage('El nombre del permiso es obligatorio')
        .isLength({ min: 3, max: 50 })
        .withMessage('El nombre del permiso debe tener entre 3 y 50 caracteres')
        .matches(/^[a-z_]+$/)
        .withMessage('El nombre del permiso solo puede contener letras minúsculas y guiones bajos')
];

const updatePermissionValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID del permiso debe ser un número entero positivo'),
    
    body('nombre_permiso')
        .optional()
        .isLength({ min: 3, max: 50 })
        .withMessage('El nombre del permiso debe tener entre 3 y 50 caracteres')
        .matches(/^[a-z_]+$/)
        .withMessage('El nombre del permiso solo puede contener letras minúsculas y guiones bajos')
];

const permissionIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID del permiso debe ser un número entero positivo')
];

// ==================== VALIDACIONES DE PRIVILEGIOS ====================

const createPrivilegeValidation = [
    body('nombre_privilegio')
        .notEmpty()
        .withMessage('El nombre del privilegio es obligatorio')
        .isLength({ min: 3, max: 30 })
        .withMessage('El nombre del privilegio debe tener entre 3 y 30 caracteres')
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)
        .withMessage('El nombre del privilegio solo puede contener letras')
        .isIn(['crear', 'leer', 'actualizar', 'eliminar'])
        .withMessage('El privilegio debe ser uno de: crear, leer, actualizar, eliminar')
];

const updatePrivilegeValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID del privilegio debe ser un número entero positivo'),
    
    body('nombre_privilegio')
        .optional()
        .isLength({ min: 3, max: 30 })
        .withMessage('El nombre del privilegio debe tener entre 3 y 30 caracteres')
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)
        .withMessage('El nombre del privilegio solo puede contener letras')
        .isIn(['crear', 'leer', 'actualizar', 'eliminar'])
        .withMessage('El privilegio debe ser uno de: crear, leer, actualizar, eliminar')
];

const privilegeIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID del privilegio debe ser un número entero positivo')
];

// ==================== VALIDACIONES DE ASIGNACIONES ====================

const assignPermissionValidation = [
    param('roleId')
        .isInt({ min: 1 })
        .withMessage('El ID del rol debe ser un número entero positivo'),
    
    body('permissionId')
        .isInt({ min: 1 })
        .withMessage('El ID del permiso debe ser un número entero positivo'),
    
    body('privilegeId')
        .isInt({ min: 1 })
        .withMessage('El ID del privilegio debe ser un número entero positivo')
];

const removePermissionValidation = [
    param('roleId')
        .isInt({ min: 1 })
        .withMessage('El ID del rol debe ser un número entero positivo'),
    
    body('permissionId')
        .isInt({ min: 1 })
        .withMessage('El ID del permiso debe ser un número entero positivo'),
    
    body('privilegeId')
        .isInt({ min: 1 })
        .withMessage('El ID del privilegio debe ser un número entero positivo')
];

const roleIdParamValidation = [
    param('roleId')
        .isInt({ min: 1 })
        .withMessage('El ID del rol debe ser un número entero positivo')
];

const bulkAssignPermissionsValidation = [
    param('roleId')
        .isInt({ min: 1 })
        .withMessage('El ID del rol debe ser un número entero positivo'),
    
    body('permissions')
        .isObject()
        .withMessage('Los permisos deben ser un objeto')
        .custom((permissions) => {
            // Validar estructura del objeto de permisos
            for (const [moduleName, privileges] of Object.entries(permissions)) {
                if (typeof moduleName !== 'string' || moduleName.length === 0) {
                    throw new Error('Los nombres de módulos deben ser cadenas no vacías');
                }
                
                if (!Array.isArray(privileges)) {
                    throw new Error('Los privilegios deben ser un array');
                }
                
                for (const privilege of privileges) {
                    if (typeof privilege !== 'string' || !['crear', 'leer', 'actualizar', 'eliminar'].includes(privilege)) {
                        throw new Error('Los privilegios deben ser: crear, leer, actualizar, eliminar');
                    }
                }
            }
            return true;
        })
];

// ==================== VALIDACIONES DE ESTADOS DE USUARIO ====================

const createUserStateValidation = [
    body('estado')
        .notEmpty()
        .withMessage('El estado es obligatorio')
        .isLength({ min: 3, max: 50 })
        .withMessage('El estado debe tener entre 3 y 50 caracteres')
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
        .withMessage('El estado solo puede contener letras y espacios')
];

const updateUserStateValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID del estado debe ser un número entero positivo'),
    
    body('estado')
        .optional()
        .isLength({ min: 3, max: 50 })
        .withMessage('El estado debe tener entre 3 y 50 caracteres')
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
        .withMessage('El estado solo puede contener letras y espacios')
];

const userStateIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID del estado debe ser un número entero positivo')
];

module.exports = {
    // Roles
    createRoleValidation,
    updateRoleValidation,
    roleIdValidation,
    
    // Permisos
    createPermissionValidation,
    updatePermissionValidation,
    permissionIdValidation,
    
    // Privilegios
    createPrivilegeValidation,
    updatePrivilegeValidation,
    privilegeIdValidation,
    
    // Asignaciones
    assignPermissionValidation,
    removePermissionValidation,
    roleIdParamValidation,
    bulkAssignPermissionsValidation,
    
    // Estados de usuario
    createUserStateValidation,
    updateUserStateValidation,
    userStateIdValidation
};
