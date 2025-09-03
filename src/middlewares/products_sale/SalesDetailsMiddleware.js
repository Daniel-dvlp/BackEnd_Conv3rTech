const { body, param } = require('express-validator');
const SaleDetail = require('../../models/products_sale/SaleDetails');
const Sale = require('../../models/products_sale/Sale');
const Product = require('../../models/products/Product');

// ✅ Validar existencia de detalle
const validateSaleDetailExistence = async (id) => {
    const detail = await SaleDetail.findByPk(id);
    if (!detail) {
        return Promise.reject('El detalle de venta no existe');
    }
};

// ✅ Validar existencia de venta
const validateSaleExistence = async (id_venta) => {
    const sale = await Sale.findByPk(id_venta);
    if (!sale) {
        return Promise.reject('La venta no existe');
    }
};

// ✅ Validar existencia de producto
const validateProductExistence = async (id_producto) => {
    const product = await Product.findByPk(id_producto);
    if (!product) {
        return Promise.reject('El producto no existe');
    }
};

// ✅ Validar que no se repita un producto en la misma venta
const validateUniqueProductInSale = async (value, { req }) => {
    const { id_venta, id_producto } = req.body;

    const existing = await SaleDetail.findOne({
        where: { id_venta, id_producto }
    });

    if (existing) {
        return Promise.reject('Este producto ya está registrado en esta venta');
    }
};

// ✅ Validaciones base
const saleDetailBaseValidation = [
    body('id_venta')
        .isInt().withMessage('El id de la venta debe ser un número entero')
        .custom(validateSaleExistence),
    body('id_producto')
        .isInt().withMessage('El id del producto debe ser un número entero')
        .custom(validateProductExistence),
    body('cantidad')
        .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor a 0'),
    body('precio_unitario')
        .isDecimal({ decimal_digits: '0,2' }).withMessage('El precio unitario debe ser un número válido')
        .custom(value => value >= 0).withMessage('El precio unitario no puede ser negativo'),
    body('subtotal_producto')
        .isDecimal({ decimal_digits: '0,2' }).withMessage('El subtotal debe ser un número válido')
        .custom(value => value >= 0).withMessage('El subtotal no puede ser negativo')
];

// ✅ Crear detalle
const createSaleDetailValidation = [
    ...saleDetailBaseValidation,
    body('id_producto').custom(validateUniqueProductInSale)
];

// ✅ Actualizar detalle
const updateSaleDetailValidation = [
    body('id_venta')
        .optional()
        .isInt().withMessage('El id de la venta debe ser un número entero')
        .custom(validateSaleExistence),
    body('id_producto')
        .optional()
        .isInt().withMessage('El id del producto debe ser un número entero')
        .custom(validateProductExistence),
    body('cantidad')
        .optional()
        .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor a 0'),
    body('precio_unitario')
        .optional()
        .isDecimal({ decimal_digits: '0,2' }).withMessage('El precio unitario debe ser un número válido')
        .custom(value => value >= 0).withMessage('El precio unitario no puede ser negativo'),
    body('subtotal_producto')
        .optional()
        .isDecimal({ decimal_digits: '0,2' }).withMessage('El subtotal debe ser un número válido')
        .custom(value => value >= 0).withMessage('El subtotal no puede ser negativo'),
    param('id')
        .isInt().withMessage('El id del detalle debe ser un número entero')
        .custom(validateSaleDetailExistence)
];

// ✅ Eliminar detalle
const deleteSaleDetailValidation = [
    param('id').isInt().withMessage('El id del detalle debe ser un número entero'),
    param('id').custom(validateSaleDetailExistence)
];

// ✅ Obtener detalle por id
const getSaleDetailByIdValidation = [
    param('id').isInt().withMessage('El id del detalle debe ser un número entero'),
    param('id').custom(validateSaleDetailExistence)
];

module.exports = {
    createSaleDetailValidation,
    updateSaleDetailValidation,
    deleteSaleDetailValidation,
    getSaleDetailByIdValidation
};
