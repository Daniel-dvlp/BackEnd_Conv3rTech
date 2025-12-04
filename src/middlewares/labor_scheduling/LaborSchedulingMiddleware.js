const { body, param } = require('express-validator');
const validateResult = require('../validate');

const validateCreateRecurringSchedule = [
    body('titulo').notEmpty().withMessage('El título es obligatorio'),
    body('usuarioIds').isArray().withMessage('usuarioIds debe ser un arreglo'),
    body('fechaInicio').isDate().withMessage('Fecha de inicio inválida'),
    body('dias').notEmpty().withMessage('Los días son obligatorios'),
    validateResult
];

const validateCreateOneTimeEvent = [
    body('titulo').notEmpty().withMessage('El título es obligatorio'),
    body('usuarioIds').isArray().withMessage('usuarioIds debe ser un arreglo'),
    body('fechaInicio').isDate().withMessage('Fecha de inicio inválida'),
    body('fechaFin').optional().isDate().withMessage('Fecha de fin inválida'),
    validateResult
];

const validateAssignScheduleToUsers = [
    param('scheduleId').isInt().withMessage('ID de horario inválido'),
    body('usuarioIds').isArray().withMessage('usuarioIds debe ser un arreglo'),
    validateResult
];

const validateUpdateSchedule = [
    param('scheduleId').isInt().withMessage('ID de horario inválido'),
    body('titulo').optional().notEmpty().withMessage('El título no puede estar vacío'),
    validateResult
];

module.exports = {
    validateCreateRecurringSchedule,
    validateCreateOneTimeEvent,
    validateAssignScheduleToUsers,
    validateUpdateSchedule
};
