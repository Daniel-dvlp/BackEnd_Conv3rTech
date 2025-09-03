const { body, param } = require('express-validator');
const ServiceCategory = require('../../models/services_categories/ServiceCategory');


const categoryExists = async (id) => {
    const category = await ServiceCategory.findByPk(id);
    if (!category) {
        return Promise.reject('La categoría de servicio no existe.');
    }
};

const isNameUnique = async (nombre) => {
    const category = await ServiceCategory.findOne({ where: { nombre } });
    if (category) {
        return Promise.reject('El nombre de la categoría ya está en uso.');
    }
};

const createCategoryValidation = [
    body('url_imagen').notEmpty().withMessage('La URL de la imagen es obligatoria.').isURL().withMessage('Debe ser una URL válida.'),
    body('nombre').notEmpty().withMessage('El nombre es obligatorio.').custom(isNameUnique),
    body('descripcion').notEmpty().withMessage('La descripción es obligatoria.').isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres.')
];

const updateCategoryValidation = [
    param('id').isInt().withMessage('El ID debe ser un número entero.').custom(categoryExists),
    body('url_imagen').optional().isURL().withMessage('Debe ser una URL válida.'),
    body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío.'),
    body('descripcion').optional().isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres.')
];

const categoryIdValidation = [
    param('id').isInt().withMessage('El ID debe ser un número entero.').custom(categoryExists)
];

module.exports = {
    createCategoryValidation,
    updateCategoryValidation,
    categoryIdValidation,
};