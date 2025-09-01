const { body, param } = require('express-validator');
const Feature = require('../../models/products/Feature');

// Validar si la característica existe
const validateFeatureExistence = async (id) => {
    const feature = await Feature.findByPk(id);
    if (!feature) {
        return Promise.reject('La característica no existe');
    }
};

// Validar que el nombre de la característica sea único
const validateUniqueFeatureName = async (nombre) => {
    const feature = await Feature.findOne({ where: { nombre : nombre } });
    if (feature) {
        return Promise.reject('La característica ya existe');
    }
};

// Validaciones base    
const featureBaseValidation = [
    body('nombre')
        .isLength({ min: 3 })
        .withMessage('El nombre debe tener al menos 3 caracteres'),
];

// Crear característica
const createFeatureValidation = [
    ...featureBaseValidation,
    body('nombre').custom(validateUniqueFeatureName)
];

// Actualizar característica
const updateFeatureValidation = [
    ...featureBaseValidation,
    param('id').isInt().withMessage('El id debe ser un número entero'),
    param('id').custom(validateFeatureExistence)
];

// Eliminar característica
const deleteFeatureValidation = [
    param('id').isInt().withMessage('El id debe ser un número entero'),
    param('id').custom(validateFeatureExistence)
];

// Obtener característica por id
const getFeatureByIdValidation = [
    param('id').isInt().withMessage('El id debe ser un número entero'),
    param('id').custom(validateFeatureExistence)
];

module.exports = {
    createFeatureValidation,
    updateFeatureValidation,
    deleteFeatureValidation,
    getFeatureByIdValidation,
};
