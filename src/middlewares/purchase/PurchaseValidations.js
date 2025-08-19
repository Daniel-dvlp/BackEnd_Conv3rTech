const { body, param } = require('express-validator');
const { validationResult } = require('express-validator');
const { getSupplierById } = require('../../repositories/supplier/SupplierRepository');

const validateCreatePurchase = [
    body('numero_recibo').isString().notEmpty().withMessage('El número de recibo es requerido y debe ser una cadena de texto.'),
    body('id_proveedor').isInt({ min: 1 }).withMessage('El ID del proveedor debe ser un número entero positivo.').custom(async (value) => {
        const supplier = await getSupplierById(value);
        if (!supplier) {
            throw new Error('El proveedor con el ID especificado no existe.');
        }
    }),
    body('monto').isFloat({ min: 0 }).withMessage('El monto debe ser un número decimal positivo.'),
    body('fecha_recibo').isISO8601().withMessage('La fecha del recibo debe ser una fecha válida en formato YYYY-MM-DD.'),
    body('iva').isFloat({ min: 0 }).withMessage('El IVA debe ser un número decimal positivo.'),
    body('detalles_compras').isArray().withMessage('Los detalles de la compra deben ser un array.').notEmpty().withMessage('Los detalles de la compra no pueden estar vacíos.'),
    body('detalles_compras.*.cantidad').isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero positivo.'),
    body('detalles_compras.*.precio_unitario').isFloat({ min: 0 }).withMessage('El precio unitario debe ser un número decimal positivo.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUpdatePurchase = [
    param('id').isInt({ min: 1 }).withMessage('El ID de la compra debe ser un número entero positivo.'),
    body('numero_recibo').optional().isString().notEmpty().withMessage('El número de recibo debe ser una cadena de texto.'),
    body('id_proveedor').optional().isInt({ min: 1 }).withMessage('El ID del proveedor debe ser un número entero positivo.').custom(async (value) => {
        const supplier = await getSupplierById(value);
        if (!supplier) {
            throw new Error('El proveedor con el ID especificado no existe.');
        }
    }),
    body('monto').optional().isFloat({ min: 0 }).withMessage('El monto debe ser un número decimal positivo.'),
    body('fecha_recibo').optional().isISO8601().withMessage('La fecha del recibo debe ser una fecha válida en formato YYYY-MM-DD.'),
    body('iva').optional().isFloat({ min: 0 }).withMessage('El IVA debe ser un número decimal positivo.'),
    body('detalles_compras').optional().isArray().withMessage('Los detalles de la compra deben ser un array.'),
    body('detalles_compras.*.cantidad').optional().isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero positivo.'),
    body('detalles_compras.*.precio_unitario').optional().isFloat({ min: 0 }).withMessage('El precio unitario debe ser un número decimal positivo.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateChangeStatePurchase = [
    param('id').isInt({ min: 1 }).withMessage('El ID de la compra debe ser un número entero positivo.'),
    body('estado').isIn(['Registrada', 'Anulada', 'Completada']).withMessage('El estado debe ser uno de los siguientes: Registrada, Anulada, Completada.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validatePurchaseId = [
    param('id').isInt({ min: 1 }).withMessage('El ID de la compra debe ser un número entero positivo.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateCreatePurchase,
    validateUpdatePurchase,
    validateChangeStatePurchase,
    validatePurchaseId
};
