const { body, param } = require('express-validator');
const Service = require('../../models/services/Service');
const ServiceCategory = require('../../models/services_categories/ServiceCategory');

const serviceExists = async (id) => {
    const service = await Service.findByPk(id);
    if (!service) {
        return Promise.reject('El servicio no existe.');
    }
};

const categoryExists = async (id_categoria_servicio) => {
    const category = await ServiceCategory.findByPk(id_categoria_servicio);
    if (!category) {
        return Promise.reject('La categoría asignada no existe.');
    }
};

const createServiceValidation = [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio.'),
    body('descripcion').notEmpty().withMessage('La descripción es obligatoria.'),
    body('precio').notEmpty().withMessage('El precio es obligatorio.')
        .isDecimal().withMessage('El precio debe ser un número decimal.'),
    body('id_categoria_servicio').isInt().withMessage('La categoría debe ser un ID válido.').custom(categoryExists)
];

const updateServiceValidation = [
    param('id').isInt().withMessage('El ID debe ser un número entero.').custom(serviceExists),
    body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío.'),
    body('descripcion').optional().notEmpty().withMessage('La descripción no puede estar vacía.'),
    body('precio').optional().isDecimal().withMessage('El precio debe ser un número decimal.'),
    body('id_categoria_servicio').optional().isInt().withMessage('La categoría debe ser un ID válido.').custom(categoryExists)
];

const serviceIdValidation = [
    param('id').isInt().withMessage('El ID debe ser un número entero.').custom(serviceExists)
];

module.exports = {
    createServiceValidation,
    updateServiceValidation,
    serviceIdValidation
};
