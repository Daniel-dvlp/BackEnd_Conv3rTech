const { body, param } = require('express-validator');
const DataSheet = require('../../models/products/Datasheet');
const Product = require('../../models/products/Product');
const Feature = require('../../models/products/Feature');

//Validar que el producto existe en BD
const validateProductExistence = async (id_producto) => {
    const product = await Product.findByPk(id_producto);
    if (!product) {
        return Promise.reject('El producto no existe');
    }
};

//Validar que la característica existe en BD
const validateFeatureExistence = async (id_caracteristica) => {
    const feature = await Feature.findByPk(id_caracteristica);
    if (!feature) {
        return Promise.reject('La característica no existe');
    }
};

// Validar si la ficha técnica existe
const validateDataSheetExistence = async (id) => {
    const datasheet = await DataSheet.findByPk(id);
    if (!datasheet) {
        return Promise.reject('La ficha técnica no existe');
    }
};

// Validar que la ficha técnica sea única
const validateUniqueDataSheet = async (value, { req }) => {
    const { id_producto, id_caracteristica } = req.body;
    const existing = await DataSheet.findOne({ 
        where: { id_producto, id_caracteristica } 
    });
    if (existing) {
        return Promise.reject('La ficha técnica para este producto y característica ya existe');
    }
};

// Validaciones base    
const dataSheetBaseValidation = [
    body('valor')
        .isLength({ min: 3 })
        .withMessage('El valor debe tener al menos 3 caracteres'),
    body('id_producto')
        .isInt().withMessage('El id_producto debe ser un número entero')
        .custom(validateProductExistence),
    body('id_caracteristica')
        .isInt().withMessage('El id_caracteristica debe ser un número entero')
        .custom(validateFeatureExistence),
];

// Crear ficha técnica
const createDataSheetValidation = [
    ...dataSheetBaseValidation,
    body().custom(validateUniqueDataSheet)
];

// Actualizar ficha técnica
const updateDataSheetValidation = [
    body('valor')
        .optional()
        .isLength({ min: 3 })
        .withMessage('El valor debe tener al menos 3 caracteres'),
    body('id_producto')
        .optional()
        .isInt().withMessage('El id_producto debe ser un número entero')
        .custom(validateProductExistence),
    body('id_caracteristica')
        .optional()
        .isInt().withMessage('El id_caracteristica debe ser un número entero')
        .custom(validateFeatureExistence),
    param('id')
        .isInt().withMessage('El id de la ficha técnica debe ser un número entero')
        .custom(validateDataSheetExistence),
];


// Eliminar característica
const deleteDataSheetValidation = [
    param('id').isInt().withMessage('El id de la ficha técnica debe ser un número entero'),
    param('id').custom(validateDataSheetExistence)
];

// Obtener ficha técnica por id
const getDataSheetByIdValidation = [
    param('id').isInt().withMessage('El id de la ficha técnica debe ser un número entero'),
    param('id').custom(validateDataSheetExistence)
];

module.exports = {
    createDataSheetValidation,
    updateDataSheetValidation,
    deleteDataSheetValidation,
    getDataSheetByIdValidation,
};
