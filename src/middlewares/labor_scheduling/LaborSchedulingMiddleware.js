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
    validateUpdateSchedule,
    validateCreateNovedad: [
        body('titulo').notEmpty().withMessage('El título es obligatorio'),
        body('usuarioIds').optional().isArray().withMessage('usuarioIds debe ser un arreglo'),
        body('usuarioId').optional().isInt().withMessage('usuarioId debe ser entero'),
        body('fechaInicio').isDate().withMessage('Fecha de inicio inválida'),
        body('fechaFin').optional().isDate().withMessage('Fecha de fin inválida'),
        body('allDay').optional().isBoolean().withMessage('allDay debe ser booleano'),
        body('horaInicio').optional().matches(/^\d{2}:\d{2}$/).withMessage('horaInicio debe ser HH:MM'),
        body('horaFin').optional().matches(/^\d{2}:\d{2}$/).withMessage('horaFin debe ser HH:MM'),
        body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('color debe ser #RRGGBB'),
        (req, res, next) => {
            const { allDay, horaInicio, horaFin, fechaInicio, fechaFin } = req.body || {};
            if (allDay === false) {
                if (!horaInicio || !horaFin) {
                    return res.status(400).json({ success: false, message: 'Defina hora de inicio y fin cuando allDay=false' });
                }
                if (horaInicio >= horaFin) {
                    return res.status(400).json({ success: false, message: 'La hora fin debe ser mayor a la hora inicio' });
                }
            }
            if (fechaFin && fechaFin < fechaInicio) {
                return res.status(400).json({ success: false, message: 'La fecha fin no puede ser anterior a la fecha inicio' });
            }
            next();
        },
        validateResult
    ],
    validateUpdateNovedad: [
        param('id').isInt().withMessage('ID de novedad inválido'),
        body('titulo').optional().notEmpty().withMessage('El título no puede estar vacío'),
        body('fechaInicio').optional().isDate().withMessage('Fecha de inicio inválida'),
        body('fechaFin').optional().isDate().withMessage('Fecha de fin inválida'),
        body('allDay').optional().isBoolean().withMessage('allDay debe ser booleano'),
        body('horaInicio').optional().matches(/^\d{2}:\d{2}$/).withMessage('horaInicio debe ser HH:MM'),
        body('horaFin').optional().matches(/^\d{2}:\d{2}$/).withMessage('horaFin debe ser HH:MM'),
        body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('color debe ser #RRGGBB'),
        (req, res, next) => {
            const { allDay, horaInicio, horaFin, fechaInicio, fechaFin } = req.body || {};
            if (allDay === false) {
                if (horaInicio && horaFin && horaInicio >= horaFin) {
                    return res.status(400).json({ success: false, message: 'La hora fin debe ser mayor a la hora inicio' });
                }
            }
            if (fechaFin && fechaInicio && fechaFin < fechaInicio) {
                return res.status(400).json({ success: false, message: 'La fecha fin no puede ser anterior a la fecha inicio' });
            }
            next();
        },
        validateResult
    ]
};
