const { body, param } = require('express-validator');
const Sale = require('../../models/products_sale/Sale');
const Client = require('../../models/clients/Clients');

// ✅ Validar existencia de venta en BD
const validateSaleExistence = async (id) => {
    const sale = await Sale.findByPk(id);
    if (!sale) {
        return Promise.reject('La venta no existe');
    }
};

// ✅ Validar existencia de cliente en BD
const validateClientExistence = async (id_cliente) => {
    const client = await Client.findByPk(id_cliente);
    if (!client) {
        return Promise.reject('El cliente no existe');
    }
};

// ✅ Validaciones base para ventas (sin los cálculos automáticos)
const saleBaseValidation = [
    body('numero_venta')
        .isLength({ min: 3 })
        .withMessage('El número de venta debe tener al menos 3 caracteres'),
    body('id_cliente')
        .isInt().withMessage('El cliente debe ser un número entero')
        .custom(validateClientExistence),
    body('fecha_venta')
        .isISO8601().withMessage('La fecha de venta debe tener un formato válido'),
    body('metodo_pago')
        .isIn(['Efectivo', 'Tarjeta', 'Transferencia'])
        .withMessage('Método de pago inválido'),
    body('estado')
        .optional()
        .isIn(['Registrada', 'Anulada'])
        .withMessage('Estado inválido')
];

// ✅ Crear venta
const createSaleValidation = [
    ...saleBaseValidation,
    body('numero_venta').custom(async (value) => {
        const existing = await Sale.findOne({ where: { numero_venta: value } });
        if (existing) {
            return Promise.reject('El número de venta ya existe');
        }
    })
];

// ✅ Actualizar venta
const updateSaleValidation = [
    body('numero_venta')
        .optional()
        .isLength({ min: 3 })
        .withMessage('El número de venta debe tener al menos 3 caracteres'),
    body('id_cliente')
        .optional()
        .isInt().withMessage('El cliente debe ser un número entero')
        .custom(validateClientExistence),
    body('fecha_venta')
        .optional()
        .isISO8601().withMessage('La fecha de venta debe tener un formato válido'),
    body('metodo_pago')
        .optional()
        .isIn(['Efectivo', 'Tarjeta', 'Transferencia'])
        .withMessage('Método de pago inválido'),
    body('estado')
        .optional()
        .isIn(['Registrada', 'Anulada'])
        .withMessage('Estado inválido'),
    param('id')
        .isInt().withMessage('El id de la venta debe ser un número entero')
        .custom(validateSaleExistence)
];

// ✅ Eliminar venta
const deleteSaleValidation = [
    param('id').isInt().withMessage('El id de la venta debe ser un número entero'),
    param('id').custom(validateSaleExistence)
];

// ✅ Obtener venta por id
const getSaleByIdValidation = [
    param('id').isInt().withMessage('El id de la venta debe ser un número entero'),
    param('id').custom(validateSaleExistence)
];

// ✅ Cambiar estado
const changeSaleStateValidation = [
    body('estado')
        .isIn(['Registrada', 'Anulada'])
        .withMessage('El estado debe ser válido'),
    param('id')
        .isInt().withMessage('El id de la venta debe ser un número entero')
        .custom(validateSaleExistence)
];

module.exports = {
    createSaleValidation,
    updateSaleValidation,
    deleteSaleValidation,
    getSaleByIdValidation,
    changeSaleStateValidation
};
