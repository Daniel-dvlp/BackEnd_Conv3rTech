const { body, param } = require('express-validator');
const Usuario = require('../../models/Users/Users');

//comentamos roles mientras se hace la tabla
//const Rol = require('../../models/Users/rol.model');

// Validaciones para verificar la existencia de un usuario
const validateUsuariosExistence = async(id) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }
}
// Validaciones para verificar la unicidad del documento y correo
const validateUsuariosUniqueDocumento = async(documento) => {
    const usuario = await Usuario.findOne({ where: { documento } });
    if (usuario) {
        throw new Error('El documento ya está en uso');
    }
}
const validateUsuariosUniqueCorreo = async(correo) => {
    const usuario = await Usuario.findOne({ where: { correo } });
    if (usuario) {
        throw new Error('El correo ya está en uso');
    }
}

// Validaciones base para los usuarios
const validateBaseUsuarios = [
    body('documento')
        .notEmpty().withMessage('El documento es obligatorio')
        .isLength({ max: 15 }).withMessage('El documento no puede exceder los 15 caracteres')
        .custom(validateUsuariosUniqueDocumento),
    body('tipo_documento')
        .notEmpty().withMessage('El tipo de documento es obligatorio')
        .isIn(['CC', 'CE', 'PPT', 'NIT']).withMessage('Tipo de documento inválido'),
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 50 }).withMessage('El nombre no puede exceder los 50 caracteres'),
    body('apellido')
        .notEmpty().withMessage('El apellido es obligatorio')
        .isLength({ max: 50 }).withMessage('El apellido no puede exceder los 50 caracteres'),
    body('celular')
        .notEmpty().withMessage('El celular es obligatorio')
        .isLength({min:7, max: 15 }).withMessage('El celular debe tener entre 7 y 15 caracteres'),
    body('correo')
        .notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('Correo electrónico inválido')
        .isLength({ max: 100 }).withMessage('El correo no puede exceder los 100 caracteres')
        .custom(validateUsuariosUniqueCorreo),
    body('contrasena')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('id_rol')
        .notEmpty().withMessage('El rol es obligatorio')
        .isLength({ max: 50 }).withMessage('El rol no puede exceder los 50 caracteres'),
    body('id_estado_usuario')
        .notEmpty().withMessage('El tipo de documento es obligatorio')
        .isIn(['Activo', 'Inactivo', 'Suspendido', 'En vacaciones', 'Retirado', 'Licencia médica'])
        .withMessage('Tipo de documento inválido'),
];

// Validaciones para crear 
const createUserValidation = [
    ...validateBaseUsuarios,
    body('documento').custom(validateUsuariosUniqueDocumento),
    body('correo').custom(validateUsuariosUniqueCorreo),
];
// Validaciones para actualizar
const updateUserValidation = [
    ...validateBaseUsuarios,
    param('id').isInt().withMessage('El ID del usuario debe ser oblogatorio'),
    param('id').custom(validateUsuariosExistence),
]
// Validaciones para eliminar
const deleteUserValidation = [
    param('id').isInt().withMessage('El ID del usuario debe ser oblogatorio'),
    param('id').custom(validateUsuariosExistence),
]
// Validaciones para buscar por Id
const findUserByIdValidation = [
    param('id').isInt().withMessage('El ID del usuario debe ser oblogatorio'),
    param('id').custom(validateUsuariosExistence),
]

module.exports = {
    createUserValidation,
    updateUserValidation,
    deleteUserValidation,
    findUserByIdValidation
};