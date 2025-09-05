const { body, param } = require('express-validator');
const Quote = require('../../models/quotes/Quote');
const QuoteDetail = require('../../models/quotes/QuoteDetails');
const Product = require('../../models/products/Product');
const Service = require('../../models/services/Service');

// ✅ Validar existencia de cotización
const validateQuoteExistence = async (id) => {
    const quote = await Quote.findByPk(id);
    if (!quote) {
        return Promise.reject('La cotización no existe');
    }
};

// ✅ Validar existencia de detalle
const validateQuoteDetailExistence = async (id) => {
    const detail = await QuoteDetail.findByPk(id);
    if (!detail) {
        return Promise.reject('El detalle de cotización no existe');
    }
};

// ✅ Validar existencia de producto
const validateProductExistence = async (id_producto) => {
    if (id_producto) {
        const product = await Product.findByPk(id_producto);
        if (!product) {
            return Promise.reject('El producto no existe');
        }
    }
};

// ✅ Validar existencia de servicio
const validateServiceExistence = async (id_servicio) => {
    if (id_servicio) {
        const service = await Service.findByPk(id_servicio);
        if (!service) {
            return Promise.reject('El servicio no existe');
        }
    }
};

// ✅ Base
const quoteDetailBaseValidation = [
    body('id_cotizacion')
        .isInt().withMessage('La cotización debe ser un número entero')
        .custom(validateQuoteExistence),
    body('id_producto')
        .optional()
        .custom(validateProductExistence),
    body('id_servicio')
        .optional()
        .custom(validateServiceExistence),
    body().custom((value, { req }) => {
        if (!req.body.id_producto && !req.body.id_servicio) {
            throw new Error('Debe asociar el detalle a un producto o un servicio');
        }
        if (req.body.id_producto && req.body.id_servicio) {
            throw new Error('El detalle no puede ser producto y servicio al mismo tiempo');
        }
        return true;
    }),
    body('cantidad')
        .isInt({ min: 1 }).withMessage('La cantidad debe ser mayor que 0'),
    body('precio_unitario')
        .isDecimal().withMessage('El precio unitario debe ser un número decimal'),
    body('subtotal')
        .isDecimal().withMessage('El subtotal debe ser un número decimal')
];

// ✅ Crear detalle
const createQuoteDetailValidation = [...quoteDetailBaseValidation];

// ✅ Actualizar detalle
const updateQuoteDetailValidation = [
    ...quoteDetailBaseValidation.map(rule => rule.optional ? rule : body(rule.builder.fields[0]).optional()),
    param('id')
        .isInt().withMessage('El id del detalle debe ser un número entero')
        .custom(validateQuoteDetailExistence)
];

// ✅ Eliminar detalle
const deleteQuoteDetailValidation = [
    param('id').isInt().withMessage('El id del detalle debe ser un número entero'),
    param('id').custom(validateQuoteDetailExistence)
];

// ✅ Obtener detalle por id
const getQuoteDetailByIdValidation = [
    param('id').isInt().withMessage('El id del detalle debe ser un número entero'),
    param('id').custom(validateQuoteDetailExistence)
];

module.exports = {
    createQuoteDetailValidation,
    updateQuoteDetailValidation,
    deleteQuoteDetailValidation,
    getQuoteDetailByIdValidation
};
