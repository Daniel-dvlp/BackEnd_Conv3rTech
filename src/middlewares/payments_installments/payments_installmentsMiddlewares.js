const { body, param } = require('express-validator');

const allowedMetodosPago = ["Efectivo", "Transferencia", "Tarjeta", "Cheque"];

/**
 * Validaciones legacy (POST /api/payments-installments)
 * Mantiene compatibilidad, pero ahora usa campo 'monto' (o acepta monto_pagado como alias)
 */
const createPagoAbonoValidation = [
  body('id_proyecto')
    .notEmpty().withMessage('id_proyecto es obligatorio')
    .isInt().withMessage('id_proyecto debe ser entero'),
  body('fecha')
    .optional()
    .isISO8601().withMessage('fecha debe ser una fecha válida'),
  // Aceptar 'monto' o 'monto_pagado' como alias, ambos positivos
  body(['monto', 'monto_pagado'])
    .custom((value, { req }) => {
      const monto = Number(req.body.monto ?? req.body.monto_pagado);
      if (!Number.isFinite(monto) || monto <= 0) {
        throw new Error('monto debe ser un número positivo');
      }
      return true;
    }),
  body('metodo_pago')
    .notEmpty().withMessage('metodo_pago es obligatorio')
    .isIn(allowedMetodosPago).withMessage('metodo_pago inválido'),
  body('estado')
    .optional()
    .isBoolean().withMessage('estado debe ser booleano'),
];

/**
 * Validaciones nuevas para rutas anidadas bajo /projects/:projectId/payments
 */
const projectIdParam = param('projectId')
  .notEmpty().withMessage('projectId es obligatorio')
  .isInt().withMessage('projectId debe ser entero');

const paymentIdParam = param('paymentId')
  .notEmpty().withMessage('paymentId es obligatorio')
  .isInt().withMessage('paymentId debe ser entero');

const createProjectPaymentValidation = [
  projectIdParam,
  body('fecha').optional().isISO8601().withMessage('fecha debe ser una fecha válida'),
  body('monto')
    .notEmpty().withMessage('monto es obligatorio')
    .isFloat({ gt: 0 }).withMessage('monto debe ser mayor a 0'),
  body('metodo_pago')
    .notEmpty().withMessage('metodo_pago es obligatorio')
    .isIn(allowedMetodosPago).withMessage('metodo_pago inválido'),
];

const listProjectPaymentsValidation = [projectIdParam];

const getProjectPaymentValidation = [projectIdParam, paymentIdParam];


const deleteProjectPaymentValidation = [projectIdParam, paymentIdParam];

/**
 * Validaciones existentes
 */
const findPagoAbonoByIdValidation = [
  param('id')
    .notEmpty().withMessage('id es obligatorio')
    .isInt().withMessage('id debe ser entero'),
];

const cancelPagoAbonoValidation = [
  param('id')
    .notEmpty().withMessage('id es obligatorio')
    .isInt().withMessage('id debe ser entero'),
  body('motivo_anulacion')
    .notEmpty().withMessage('El motivo de anulación es obligatorio')
    .isString().withMessage('El motivo de anulación debe ser texto')
    .trim()
    .isLength({ min: 5 }).withMessage('El motivo de anulación debe tener al menos 5 caracteres'),
];

const searchPagosAbonosValidation = [
  param('term').optional().isString().withMessage('term debe ser texto'),
];

module.exports = {
  // Legacy
  createPagoAbonoValidation,
  findPagoAbonoByIdValidation,
  cancelPagoAbonoValidation,
  searchPagosAbonosValidation,
  // Nuevas para rutas por proyecto
  createProjectPaymentValidation,
  listProjectPaymentsValidation,
  getProjectPaymentValidation,
  deleteProjectPaymentValidation,
};


