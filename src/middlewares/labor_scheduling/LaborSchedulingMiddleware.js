const { body, validationResult } = require('express-validator');

// Expresión regular para validar el formato de hora HH:MM:SS
const timeRegex = /^(?:2[0-3]|[01]?[0-9]):[0-5]?[0-9]:[0-5]?[0-9]$/;

const validateCreateScheduling = [
    body('fecha_inicio')
        .isISO8601().withMessage('La fecha de inicio debe ser una fecha válida (YYYY-MM-DD).')
        .notEmpty().withMessage('La fecha de inicio es requerida.'),
    body('hora_inicio')
        .matches(timeRegex).withMessage('La hora de inicio debe tener el formato HH:MM:SS.')
        .notEmpty().withMessage('La hora de inicio es requerida.'),
    body('hora_fin')
        .matches(timeRegex).withMessage('La hora de fin debe tener el formato HH:MM:SS.')
        .notEmpty().withMessage('La hora de fin es requerida.')
        .custom((value, { req }) => {
            if (value <= req.body.hora_inicio) {
                throw new Error('La hora de fin debe ser posterior a la hora de inicio.');
            }
            return true;
        }),
    body('id_usuario')
        .isInt({ min: 1 }).withMessage('El ID de usuario debe ser un número entero válido.')
        .notEmpty().withMessage('El ID de usuario es requerido.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateCreateScheduling
};