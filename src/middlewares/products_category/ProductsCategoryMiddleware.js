const { body, param } = require('express-validator');
const ProductCategory = require('../../models/products_category/ProductsCategory');

const validateCategoryExistence = async (id) => {
    const category = await ProductCategory.findByPk(id);
    if (!category) {
        return Promise.reject('La categoría no existe');
    }
};

const validateUniqueCategoryName = async (name) => {
    const category = await ProductCategory.findOne({ where: { nombre: name } });
    if (category) {
        return Promise.reject('La categoría ya existe');
    }
};

const categoryBaseValidation = [
    body('name')
        .isLength({ min: 6 })
        .withMessage('El nombre debe tener más de 5 caracteres'),
    body('description')
        .optional({ nullable: true })
        .isLength({ min: 10 })
        .withMessage('La descripción debe tener al menos 10 caracteres'),
    body('state')
        .optional()
        .isBoolean()
        .withMessage('El estado debe ser un valor booleano')
];

const createCategoryValidation = [
    ...categoryBaseValidation,
    body('name').custom(validateUniqueCategoryName)
];

const updateCategoryValidation = [
    ...categoryBaseValidation,
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
    body('state')
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
