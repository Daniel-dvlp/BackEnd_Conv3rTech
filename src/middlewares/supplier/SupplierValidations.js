const { body, param } = require('express-validator');
const Supplier = require('../../models/supplier/SupplierModel');

const validateSupplierExistence = async (id_proveedor) => {
    const supplier = await Supplier.findByPk(id_proveedor);
    if (!supplier) {
        throw new Error('Proveedor no encontrado');
    }
};

const validateUniqueNit = async (nit) => {
    if (nit) {
        const existingSupplier = await Supplier.findOne({ where: { nit } });
        if (existingSupplier) {
            throw new Error('El NIT ya está registrado');
        }
    }
};

const validateUniqueName = async (nombre_empresa) => {
    const existingSupplier = await Supplier.findOne({ where: { nombre_empresa } });
    if (existingSupplier) {
        throw new Error('El nombre de la entidad ya está registrado');
    }
};

const validateUniqueEmail = async (correo_principal) => {
    const existingSupplier = await Supplier.findOne({ where: { correo_principal } });
    if (existingSupplier) {
        throw new Error('El correo principal ya está registrado');
    }
};

const validateUniqueEmailSecundario = async (correo_secundario) => {
    if (correo_secundario) {
        const existingSupplier = await Supplier.findOne({ where: { correo_secundario } });
        if (existingSupplier) {
            throw new Error('El correo secundario ya está registrado');
        }
    }
};

const validateUniqueNitUpdate = async (nit, { req }) => {
    if (nit) {
        const existingSupplier = await Supplier.findOne({ where: { nit } });
        if (existingSupplier && existingSupplier.id_proveedor != req.params.id) {
            throw new Error('El NIT ya está registrado');
        }
    }
};

const validateUniqueNameUpdate = async (nombre_empresa, { req }) => {
    const existingSupplier = await Supplier.findOne({ where: { nombre_empresa } });
    if (existingSupplier && existingSupplier.id_proveedor != req.params.id) {
        throw new Error('El nombre de la entidad ya está registrado');
    }
};

const validateUniqueEmailUpdate = async (correo_principal, { req }) => {
    const existingSupplier = await Supplier.findOne({ where: { correo_principal } });
    if (existingSupplier && existingSupplier.id_proveedor != req.params.id) {
        throw new Error('El correo principal ya está registrado');
    }
};

const validateUniqueEmailSecundarioUpdate = async (correo_secundario, { req }) => {
    if (correo_secundario) {
        const existingSupplier = await Supplier.findOne({ where: { correo_secundario } });
        if (existingSupplier && existingSupplier.id_proveedor != req.params.id) {
            throw new Error('El correo secundario ya está registrado');
        }
    }
};

const createSupplierValidation = [
    body('nit')
        .optional()
        .isAlphanumeric().withMessage('El NIT debe ser alfanumérico')
        .isLength({ max: 30 }).withMessage('El NIT no puede exceder los 30 caracteres')
        .custom(validateUniqueNit),
    body('nombre_encargado')
        .notEmpty().withMessage('El nombre del encargado es obligatorio')
        .isLength({ max: 150 }).withMessage('El nombre del encargado no puede exceder los 150 caracteres'),
    body('nombre_empresa')
        .notEmpty().withMessage('El nombre de la entidad es obligatorio')
        .isLength({ max: 150 }).withMessage('El nombre de la entidad no puede exceder los 150 caracteres')
        .custom(validateUniqueName),
    body('telefono_entidad')
        .notEmpty().withMessage('El teléfono de la entidad es obligatorio')
        .isLength({ max: 20 }).withMessage('El teléfono de la entidad no puede exceder los 20 caracteres')
        .matches(/^[0-9+\-\s()]+$/).withMessage('El teléfono de la entidad contiene caracteres no válidos'),
    body('telefono_encargado')
        .optional()
        .isLength({ max: 20 }).withMessage('El teléfono del encargado no puede exceder los 20 caracteres')
        .matches(/^[0-9+\-\s()]+$/).withMessage('El teléfono del encargado contiene caracteres no válidos'),
    body('correo_principal')
        .notEmpty().withMessage('El correo principal es obligatorio')
        .isEmail().withMessage('El correo principal debe ser válido')
        .custom(validateUniqueEmail),
    body('correo_secundario')
        .optional()
        .isEmail().withMessage('El correo secundario debe ser válido')
        .custom(validateUniqueEmailSecundario),
    body('direccion')
        .optional()
        .isLength({ max: 200 }).withMessage('La dirección no puede exceder los 200 caracteres'),
    body('estado')
        .optional()
        .isIn(['Activo', 'Inactivo']).withMessage('El estado debe ser Activo o Inactivo'),
    body('observaciones')
        .optional()
        .isLength({ max: 500 }).withMessage('Las observaciones no pueden exceder los 500 caracteres')
];

const updateSupplierValidation = [
    param('id').isInt().withMessage('El ID del proveedor debe ser un número entero').custom(validateSupplierExistence),
    body('nit')
        .optional()
        .isAlphanumeric().withMessage('El NIT debe ser alfanumérico')
        .isLength({ max: 30 }).withMessage('El NIT no puede exceder los 30 caracteres')
        .custom(validateUniqueNitUpdate),
    body('nombre_encargado')
        .optional()
        .isLength({ max: 150 }).withMessage('El nombre del encargado no puede exceder los 150 caracteres'),
    body('nombre_empresa')
        .optional()
        .isLength({ max: 150 }).withMessage('El nombre de la entidad no puede exceder los 150 caracteres')
        .custom(validateUniqueNameUpdate),
    body('telefono_entidad')
        .optional()
        .isLength({ max: 20 }).withMessage('El teléfono de la entidad no puede exceder los 20 caracteres')
        .matches(/^[0-9+\-\s()]+$/).withMessage('El teléfono de la entidad contiene caracteres no válidos'),
    body('telefono_encargado')
        .optional()
        .isLength({ max: 20 }).withMessage('El teléfono del encargado no puede exceder los 20 caracteres')
        .matches(/^[0-9+\-\s()]+$/).withMessage('El teléfono del encargado contiene caracteres no válidos'),
    body('correo_principal')
        .optional()
        .isEmail().withMessage('El correo principal debe ser válido')
        .custom(validateUniqueEmailUpdate),
    body('correo_secundario')
        .optional()
        .isEmail().withMessage('El correo secundario debe ser válido')
        .custom(validateUniqueEmailSecundarioUpdate),
    body('direccion')
        .optional()
        .isLength({ max: 200 }).withMessage('La dirección no puede exceder los 200 caracteres'),
    body('estado')
        .optional()
        .isIn(['Activo', 'Inactivo']).withMessage('El estado debe ser Activo o Inactivo'),
    body('observaciones')
        .optional()
        .isLength({ max: 500 }).withMessage('Las observaciones no pueden exceder los 500 caracteres')
];

const deleteSupplierValidation = [
    param('id').isInt().withMessage('El ID del proveedor debe ser un número entero').custom(validateSupplierExistence)
];

const findSupplierByIdValidation = [
    param('id').isInt().withMessage('El ID del proveedor debe ser un número entero').custom(validateSupplierExistence)
];

const changeStateSupplierValidation = [
    param('id').isInt().withMessage('El ID del proveedor debe ser un número entero').custom(validateSupplierExistence),
    body('estado').notEmpty().withMessage('El estado es obligatorio').isIn(['Activo', 'Inactivo']).withMessage('El estado debe ser Activo o Inactivo')
];

module.exports = {
    createSupplierValidation,
    updateSupplierValidation,
    deleteSupplierValidation,
    findSupplierByIdValidation,
    changeStateSupplierValidation
};
