const { body, param } = require('express-validator');
const Quote = require('../../models/quotes/Quote');
const Client = require('../../models/clients/Clients');

// ✅ Validar existencia de cotización en BD
const validateQuoteExistence = async (id) => {
    const quote = await Quote.findByPk(id);
    if (!quote) {
        return Promise.reject('La cotización no existe');
    }
};

// ✅ Validar existencia de cliente en BD
const validateClientExistence = async (id_cliente) => {
    const client = await Client.findByPk(id_cliente);
    if (!client) {
        return Promise.reject('El cliente no existe');
    }
};

// ✅ Validaciones base
const quoteBaseValidation = [
    body('nombre_cotizacion')
        .isLength({ min: 3 })
        .withMessage('El nombre de la cotización debe tener al menos 3 caracteres'),
    body('id_cliente')
        .isInt().withMessage('El cliente debe ser un número entero')
        .custom(validateClientExistence),
    body('fecha_vencimiento')
        .isISO8601().withMessage('La fecha de vencimiento debe tener un formato válido'),
    body('observaciones')
        .optional()
        .isString().withMessage('Las observaciones deben ser texto'),
    body('motivo_anulacion')
        .optional()
        .isString().withMessage('El motivo de anulación debe ser texto'),
    body('estado')
        .optional()
        .isIn(['Pendiente', 'Aprobada', 'Aceptada', 'Rechazada'])
        .withMessage('Estado inválido')
];

// ✅ Crear cotización
const createQuoteValidation = [
    ...quoteBaseValidation,
    body('nombre_cotizacion').custom(async (value, { req }) => {
        const existing = await Quote.findOne({
            where: { nombre_cotizacion: value, id_cliente: req.body.id_cliente }
        });
        if (existing) {
            return Promise.reject('Ya existe una cotización con ese nombre para este cliente');
        }
    })
];

// ✅ Actualizar cotización
const updateQuoteValidation = [
    body('nombre_cotizacion')
        .optional()
        .isLength({ min: 3 })
        .withMessage('El nombre de la cotización debe tener al menos 3 caracteres'),
    body('id_cliente')
        .optional()
        .isInt().withMessage('El cliente debe ser un número entero')
        .custom(validateClientExistence),
    body('fecha_vencimiento')
        .optional()
        .isISO8601().withMessage('La fecha de vencimiento debe tener un formato válido'),
    body('observaciones')
        .optional()
        .isString().withMessage('Las observaciones deben ser texto'),
    body('motivo_anulacion')
        .optional()
        .isString().withMessage('El motivo de anulación debe ser texto'),
    body('estado')
        .optional()
        .isIn(['Pendiente', 'Aprobada', 'Aceptada', 'Rechazada'])
        .withMessage('Estado inválido'),
    body('detalles')
        .optional()
        .isArray().withMessage('Los detalles deben ser un array'),
    body('detalles.*.id_producto')
        .optional()
        .isInt().withMessage('El id_producto debe ser un número entero'),
    body('detalles.*.id_servicio')
        .optional()
        .isInt().withMessage('El id_servicio debe ser un número entero'),
    body('detalles.*.cantidad')
        .optional()
        .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor a 0'),
    param('id')
        .isInt().withMessage('El id de la cotización debe ser un número entero')
        .custom(validateQuoteExistence)
];

// ✅ Eliminar cotización
const deleteQuoteValidation = [
    param('id').isInt().withMessage('El id de la cotización debe ser un número entero'),
    param('id').custom(validateQuoteExistence)
];

// ✅ Obtener cotización por id
const getQuoteByIdValidation = [
    param('id').isInt().withMessage('El id de la cotización debe ser un número entero'),
    param('id').custom(validateQuoteExistence)
];

// ✅ Cambiar estado
const changeQuoteStateValidation = [
    body('estado')
        .isIn(['Pendiente', 'Aprobada', 'Aceptada', 'Rechazada'])
        .withMessage('El estado debe ser válido'),
    body('motivo_anulacion')
        .optional()
        .isString().withMessage('El motivo de anulación debe ser texto'),
    param('id')
        .isInt().withMessage('El id de la cotización debe ser un número entero')
        .custom(validateQuoteExistence)
];

module.exports = {
    createQuoteValidation,
    updateQuoteValidation,
    deleteQuoteValidation,
    getQuoteByIdValidation,
    changeQuoteStateValidation
};
