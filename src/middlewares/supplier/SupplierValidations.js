const { body, param } = require('express-validator');
const Supplier = require('../../models/supplier/SupplierModel');

const validateSupplierExistence = async (id_proveedor) => {
    const supplier = await Supplier.findByPk(id_proveedor);
    if (!supplier) {
        throw new Error('Proveedor no encontrado');
    }
};

const validateUniqueNit = async (nit) => {
    const existingSupplier = await Supplier.findOne({ where: { nit } });
    if (existingSupplier) {
        throw new Error('El NIT ya está registrado');
    }
};

const validateUniqueName = async (nombre_empresa) => {
    const existingSupplier = await Supplier.findOne({ where: { nombre_empresa } });
    if (existingSupplier) {
        throw new Error('El nombre de la empresa ya está registrado');
    }
};

const validateUniqueEmail = async (correo) => {
    const existingSupplier = await Supplier.findOne({ where: { correo } });
    if (existingSupplier) {
        throw new Error('El correo electrónico ya está registrado');
    }
};

const validateUniqueNitUpdate = async (nit, { req }) => {
    const existingSupplier = await Supplier.findOne({ where: { nit } });
    if (existingSupplier && existingSupplier.id_proveedor != req.params.id) {
        throw new Error('El NIT ya está registrado');
    }
};

const validateUniqueNameUpdate = async (nombre_empresa, { req }) => {
    const existingSupplier = await Supplier.findOne({ where: { nombre_empresa } });
    if (existingSupplier && existingSupplier.id_proveedor != req.params.id) {
        throw new Error('El nombre de la empresa ya está registrado');
    }
};

const validateUniqueEmailUpdate = async (correo, { req }) => {
    const existingSupplier = await Supplier.findOne({ where: { correo } });
    if (existingSupplier && existingSupplier.id_proveedor != req.params.id) {
        throw new Error('El correo electrónico ya está registrado');
    }
};

const createSupplierValidation = [
    body('nit')
        .notEmpty().withMessage('El NIT es obligatorio')
        .isLength({ max: 15 }).withMessage('El NIT no puede exceder los 15 caracteres')
        .custom(validateUniqueNit),
    body('nombre_encargado')
        .notEmpty().withMessage('El nombre del encargado es obligatorio')
        .isLength({ max: 50 }).withMessage('El nombre del encargado no puede exceder los 50 caracteres'),
    body('nombre_empresa')
        .notEmpty().withMessage('El nombre de la empresa es obligatorio')
        .isLength({ max: 50 }).withMessage('El nombre de la empresa no puede exceder los 50 caracteres')
        .custom(validateUniqueName),
    body('telefono')
        .notEmpty().withMessage('El teléfono es obligatorio')
        .isLength({ max: 15 }).withMessage('El teléfono no puede exceder los 15 caracteres'),
    body('correo')
        .notEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('El correo electrónico debe ser válido')
        .custom(validateUniqueEmail),
    body('direccion')
        .notEmpty().withMessage('La dirección es obligatoria')
        .isLength({ max: 255 }).withMessage('La dirección no puede exceder los 255 caracteres'),
    body('estado')
        .optional()
        .isBoolean().withMessage('El estado debe ser un valor booleano')
];

const updateSupplierValidation = [
    param('id').isInt().withMessage('El ID del proveedor debe ser un número entero').custom(validateSupplierExistence),
    body('nit')
        .optional()
        .isLength({ max: 15 }).withMessage('El NIT no puede exceder los 15 caracteres')
        .custom(validateUniqueNitUpdate),
    body('nombre_encargado')
        .optional()
        .isLength({ max: 50 }).withMessage('El nombre del encargado no puede exceder los 50 caracteres'),
    body('nombre_empresa')
        .optional()
        .isLength({ max: 50 }).withMessage('El nombre de la empresa no puede exceder los 50 caracteres')
        .custom(validateUniqueNameUpdate),
    body('telefono')
        .optional()
        .isLength({ max: 15 }).withMessage('El teléfono no puede exceder los 15 caracteres'),
    body('correo')
        .optional()
        .isEmail().withMessage('El correo electrónico debe ser válido')
        .custom(validateUniqueEmailUpdate),
    body('direccion')
        .optional()
        .isLength({ max: 255 }).withMessage('La dirección no puede exceder los 255 caracteres'),
    body('estado')
        .optional()
        .isBoolean().withMessage('El estado debe ser un valor booleano')
];

const deleteSupplierValidation = [
    param('id').isInt().withMessage('El ID del proveedor debe ser un número entero').custom(validateSupplierExistence)
];

const findSupplierByIdValidation = [
    param('id').isInt().withMessage('El ID del proveedor debe ser un número entero').custom(validateSupplierExistence)
];

const changeStateSupplierValidation = [
    param('id').isInt().withMessage('El ID del proveedor debe ser un número entero').custom(validateSupplierExistence),
    body('estado').notEmpty().withMessage('El estado es obligatorio').isBoolean().withMessage('El estado debe ser un valor booleano')
];

module.exports = {
    createSupplierValidation,
    updateSupplierValidation,
    deleteSupplierValidation,
    findSupplierByIdValidation,
    changeStateSupplierValidation
};
