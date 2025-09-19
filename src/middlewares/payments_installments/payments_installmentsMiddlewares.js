const { body, param } = require('express-validator');

const allowedMetodosPago = ["Efectivo", "Transferencia", "Tarjeta", "Cheque"];

const createPagoAbonoValidation = [
    body('id_proyecto')
        .notEmpty().withMessage('id_proyecto es obligatorio')
        .isInt().withMessage('id_proyecto debe ser entero'),
    body('id_venta')
        .optional({ nullable: true })
        .isInt().withMessage('id_venta debe ser entero'),
    body('fecha')
        .optional()
        .isISO8601().withMessage('fecha debe ser una fecha válida'),
    body('monto_total')
        .notEmpty().withMessage('monto_total es obligatorio')
        .isFloat({ gt: 0 }).withMessage('monto_total debe ser mayor a 0'),
    body('monto_pagado')
        .notEmpty().withMessage('monto_pagado es obligatorio')
        .isFloat({ gt: 0 }).withMessage('monto_pagado debe ser mayor a 0')
        .custom((value, { req }) => {
            const total = Number(req.body.monto_total);
            const pagado = Number(value);
            if (!Number.isFinite(total) || !Number.isFinite(pagado)) return true;
            if (pagado > total) {
                throw new Error('monto_pagado no puede ser mayor que monto_total');
            }
            return true;
        }),
    body('metodo_pago')
        .notEmpty().withMessage('metodo_pago es obligatorio')
        .isIn(allowedMetodosPago).withMessage('metodo_pago inválido'),
    body('estado')
        .optional()
        .isBoolean().withMessage('estado debe ser booleano')
];

const findPagoAbonoByIdValidation = [
    param('id')
        .notEmpty().withMessage('id es obligatorio')
        .isInt().withMessage('id debe ser entero')
];

const cancelPagoAbonoValidation = [
    param('id')
        .notEmpty().withMessage('id es obligatorio')
        .isInt().withMessage('id debe ser entero')
];

const searchPagosAbonosValidation = [
    param('term')
        .optional()
        .isString().withMessage('term debe ser texto')
];

module.exports = {
    createPagoAbonoValidation,
    findPagoAbonoByIdValidation,
    cancelPagoAbonoValidation,
    searchPagosAbonosValidation
};


