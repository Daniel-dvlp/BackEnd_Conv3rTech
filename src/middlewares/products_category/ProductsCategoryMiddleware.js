const { body, param } = require('express-validator');
const ProductCategory = require('../../models/products_category/ProductsCategory');

const validateCategoryExistence = async (id) => {
    const category = await ProductCategory.findByPk(id);
    if (!category) {
        return Promise.reject('La categoría no existe');
    }
};

const validateUniqueCategoryName = async (nombre) => {
    const category = await ProductCategory.findOne({ where: { nombre: nombre } });
    if (category) {
        return Promise.reject('La categoría ya existe');
    }
};

const categoryBaseValidation = [
    body('nombre')
        .isLength({ min: 5 })
        .withMessage('El nombre debe tener 5 o más caracteres'),
    body('descripcion')
        .optional({ nullable: true })
        .isLength({ min: 10 })
        .withMessage('La descripción debe tener al menos 10 caracteres'),
    body('estado')
        .optional()
        .isBoolean()
        .withMessage('El estado debe ser un valor booleano')
];

const createCategoryValidation = [
    ...categoryBaseValidation,
    body('nombre').custom(validateUniqueCategoryName)
];

const updateCategoryValidation = [
    body('nombre')
        .optional()
        .isLength({ min: 5 })
        .withMessage('El nombre debe tener 5 o más caracteres'),
    body('descripcion')
        .optional({ nullable: true })
        .isLength({ min: 10 })
        .withMessage('La descripción debe tener al menos 10 caracteres'),
    body('estado')
        .optional()
        .isBoolean()
        .withMessage('El estado debe ser un valor booleano'),
    param('id').isInt().withMessage('El id debe ser un número entero'),
    param('id').custom(validateCategoryExistence)
];

const deleteCategoryValidation = [
    param('id').isInt().withMessage('El id debe ser un número entero'),
    param('id').custom(validateCategoryExistence)
];

const getCategoryByIdValidation = [
    param('id').isInt().withMessage('El id debe ser un número entero'),
    param('id').custom(validateCategoryExistence)
];

const changeStateValidation = [
    body('estado')
        .isBoolean()
        .withMessage('El estado debe ser un valor booleano'),
    param('id').isInt().withMessage('El id debe ser un número entero'),
    param('id').custom(validateCategoryExistence)
];

module.exports = {
    createCategoryValidation,
    updateCategoryValidation,
    deleteCategoryValidation,
    getCategoryByIdValidation,
    changeStateValidation,
};
