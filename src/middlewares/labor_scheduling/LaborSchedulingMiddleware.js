const { body, validationResult } = require('express-validator');
const LaborSchedulingService = require('../../services/labor_scheduling/LaborSchedulingService');

/**
 * Helper function to check if two time ranges overlap
 */
const timeRangesOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

/**
 * Helper function to check if dates overlap considering recurrence
 */
const datesOverlap = (date1, date2, recurrence1, recurrence2) => {
  // For events (no recurrence), check exact date match
  if (!recurrence1 && !recurrence2) {
    return date1 === date2;
  }

  // For schedules with recurrence, check if they share any days
  if (recurrence1 && recurrence2) {
    return recurrence1.some(day => recurrence2.includes(day));
  }

  // One is event, one is schedule - check if event date falls on schedule day
  const eventDate = new Date(!recurrence1 ? date1 : date2);
  const scheduleRecurrence = recurrence1 || recurrence2;

  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const eventDay = dayNames[eventDate.getDay()];

  return scheduleRecurrence.includes(eventDay);
};

/**
 * Valida que no haya conflictos de solapamiento para horarios recurrentes
 */
const validateNoScheduleConflicts = async (req, res, next) => {
  try {
    const { fecha_inicio, recurrencia_semanal, hora_inicio, hora_fin, userIds } = req.body;

    if (!userIds || userIds.length === 0) {
      return next();
    }

    // Check each user for conflicts
    for (const userId of userIds) {
      const existingSchedules = await LaborSchedulingService.getSchedulesByUser(userId);

      for (const existing of existingSchedules) {
        // Only check conflicts with other schedules (not events)
        if (existing.tipo === 'horario') {
          // Check if dates overlap
          if (datesOverlap(fecha_inicio, existing.fecha_inicio, recurrencia_semanal, existing.recurrencia_semanal)) {
            // Check if times overlap
            if (timeRangesOverlap(hora_inicio, hora_fin, existing.hora_inicio, existing.hora_fin)) {
              return res.status(400).json({
                success: false,
                message: `Conflicto de horario: El usuario ya tiene un horario asignado que se solapa con el nuevo horario.`,
                conflict: {
                  existingSchedule: existing,
                  newSchedule: { fecha_inicio, recurrencia_semanal, hora_inicio, hora_fin }
                }
              });
            }
          }
        }
      }
    }

    next();
  } catch (error) {
    console.error('Error validating schedule conflicts:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al validar conflictos de horario.'
    });
  }
};

/**
 * Valida que no haya conflictos de solapamiento para eventos únicos
 */
const validateNoEventConflicts = async (req, res, next) => {
  try {
    const { fecha, fecha_fin, hora_inicio, hora_fin, userIds } = req.body;

    if (!userIds || userIds.length === 0) {
      return next();
    }

    // Check each user for conflicts
    for (const userId of userIds) {
      const existingEvents = await LaborSchedulingService.getEventsByUser(userId);

      for (const existing of existingEvents) {
        // Check conflicts with other events
        if (existing.tipo === 'evento') {
          // For events, check exact date overlap
          if (fecha === existing.fecha) {
            // Check if times overlap
            if (timeRangesOverlap(hora_inicio, hora_fin, existing.hora_inicio, existing.hora_fin)) {
              return res.status(400).json({
                success: false,
                message: `Conflicto de evento: El usuario ya tiene un evento asignado que se solapa con el nuevo evento.`,
                conflict: {
                  existingEvent: existing,
                  newEvent: { fecha, hora_inicio, hora_fin }
                }
              });
            }
          }
        }
      }
    }

    next();
  } catch (error) {
    console.error('Error validating event conflicts:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al validar conflictos de evento.'
    });
  }
};

/**
 * Valida que eventos no se solapen con horarios existentes (pero permite que eventos cubran horarios)
 */
const validateEventCanCoverSchedule = async (req, res, next) => {
  try {
    const { fecha, hora_inicio, hora_fin, userIds } = req.body;

    if (!userIds || userIds.length === 0) {
      return next();
    }

    // Check each user - events can cover schedules, so no validation needed here
    // The logic is: events can overlap with schedules, but schedules cannot overlap with events
    // Since we're creating an event, we allow it to overlap with schedules

    next();
  } catch (error) {
    console.error('Error validating event-schedule overlap:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al validar solapamiento evento-horario.'
    });
  }
};

/**
 * Valida la creación de un horario recurrente
 */
const validateCreateRecurringSchedule = [
    body('fecha_inicio')
        .isISO8601().withMessage('La fecha de inicio debe ser una fecha válida (ISO 8601).')
        .custom((value) => {
            if (new Date(value) < new Date()) {
                throw new Error('La fecha de inicio no puede ser en el pasado.');
            }
            return true;
        }),
    body('recurrencia_semanal')
        .isArray({ min: 1 }).withMessage('Se requiere al menos un día de la semana.')
        .custom((value) => {
            const validDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
            if (!value.every(day => validDays.includes(day))) {
                throw new Error('Los días de la semana deben ser válidos.');
            }
            return true;
        }),
    body('hora_inicio')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('La hora de inicio debe tener formato HH:MM.'),
    body('hora_fin')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('La hora de fin debe tener formato HH:MM.')
        .custom((value, { req }) => {
            if (value <= req.body.hora_inicio) {
                throw new Error('La hora de fin debe ser posterior a la hora de inicio.');
            }
            return true;
        }),
    body('color')
        .optional()
        .matches(/^#[0-9A-F]{6}$/i).withMessage('El color debe ser un código hexadecimal válido.'),
    body('userIds')
        .optional()
        .isArray().withMessage('Los userIds deben ser un array.')
        .custom((value) => {
            if (value && !value.every(id => Number.isInteger(id) && id > 0)) {
                throw new Error('Todos los userIds deben ser números enteros positivos.');
            }
            return true;
        }),
    validateNoScheduleConflicts,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
                message: 'Errores de validación',
            });
        }
        next();
    }
];

/**
 * Valida la creación de un evento único
 */
const validateCreateOneTimeEvent = [
    body('fecha')
        .isISO8601().withMessage('La fecha debe ser una fecha válida (ISO 8601).')
        .custom((value) => {
            if (new Date(value) < new Date()) {
                throw new Error('La fecha del evento no puede ser en el pasado.');
            }
            return true;
        }),
    body('fecha_fin')
        .optional()
        .isISO8601().withMessage('La fecha de fin debe ser una fecha válida (ISO 8601).')
        .custom((value, { req }) => {
            if (value && new Date(value) < new Date(req.body.fecha)) {
                throw new Error('La fecha de fin debe ser igual o posterior a la fecha del evento.');
            }
            return true;
        }),
    body('observacion')
        .notEmpty().withMessage('La observación es requerida.')
        .isLength({ min: 1, max: 500 }).withMessage('La observación debe tener entre 1 y 500 caracteres.'),
    body('hora_inicio')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('La hora de inicio debe tener formato HH:MM.'),
    body('hora_fin')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('La hora de fin debe tener formato HH:MM.')
        .custom((value, { req }) => {
            if (value <= req.body.hora_inicio) {
                throw new Error('La hora de fin debe ser posterior a la hora de inicio.');
            }
            return true;
        }),
    body('color')
        .optional()
        .matches(/^#[0-9A-F]{6}$/i).withMessage('El color debe ser un código hexadecimal válido.'),
    body('userIds')
        .optional()
        .isArray().withMessage('Los userIds deben ser un array.')
        .custom((value) => {
            if (value && !value.every(id => Number.isInteger(id) && id > 0)) {
                throw new Error('Todos los userIds deben ser números enteros positivos.');
            }
            return true;
        }),
    validateNoEventConflicts,
    validateEventCanCoverSchedule,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
                message: 'Errores de validación',
            });
        }
        next();
    }
];

/**
 * Valida la asignación de usuarios a un horario
 */
const validateAssignScheduleToUsers = [
    body('userIds')
        .isArray({ min: 1 }).withMessage('Se requiere al menos un userId.')
        .custom((value) => {
            if (!value.every(id => Number.isInteger(id) && id > 0)) {
                throw new Error('Todos los userIds deben ser números enteros positivos.');
            }
            return true;
        }),
    body('notes')
        .optional()
        .isLength({ max: 500 }).withMessage('Las notas no pueden exceder 500 caracteres.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
                message: 'Errores de validación',
            });
        }
        next();
    }
];

/**
 * Valida la actualización de un horario
 */
const validateUpdateSchedule = [
    body('fecha_inicio')
        .optional()
        .isISO8601().withMessage('La fecha de inicio debe ser una fecha válida (ISO 8601).')
        .custom((value) => {
            if (value && new Date(value) < new Date()) {
                throw new Error('La fecha de inicio no puede ser en el pasado.');
            }
            return true;
        }),
    body('recurrencia_semanal')
        .optional()
        .isArray({ min: 1 }).withMessage('Se requiere al menos un día de la semana.')
        .custom((value) => {
            if (value) {
                const validDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
                if (!value.every(day => validDays.includes(day))) {
                    throw new Error('Los días de la semana deben ser válidos.');
                }
            }
            return true;
        }),
    body('fecha')
        .optional()
        .isISO8601().withMessage('La fecha debe ser una fecha válida (ISO 8601).')
        .custom((value) => {
            if (value && new Date(value) < new Date()) {
                throw new Error('La fecha del evento no puede ser en el pasado.');
            }
            return true;
        }),
    body('fecha_fin')
        .optional()
        .isISO8601().withMessage('La fecha de fin debe ser una fecha válida (ISO 8601).'),
    body('observacion')
        .optional()
        .isLength({ min: 1, max: 500 }).withMessage('La observación debe tener entre 1 y 500 caracteres.'),
    body('hora_inicio')
        .optional()
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('La hora de inicio debe tener formato HH:MM.'),
    body('hora_fin')
        .optional()
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('La hora de fin debe tener formato HH:MM.')
        .custom((value, { req }) => {
            if (value && req.body.hora_inicio && value <= req.body.hora_inicio) {
                throw new Error('La hora de fin debe ser posterior a la hora de inicio.');
            }
            return true;
        }),
    body('color')
        .optional()
        .matches(/^#[0-9A-F]{6}$/i).withMessage('El color debe ser un código hexadecimal válido.'),
    body('estado')
        .optional()
        .isIn(['Activo', 'Inactivo']).withMessage('El estado debe ser Activo o Inactivo.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
                message: 'Errores de validación',
            });
        }
        next();
    }
];

module.exports = {
    validateCreateRecurringSchedule,
    validateCreateOneTimeEvent,
    validateAssignScheduleToUsers,
    validateUpdateSchedule,
};