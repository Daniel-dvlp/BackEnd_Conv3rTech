const LaborSchedulingService = require('../../services/labor_scheduling/LaborSchedulingService');

/**
 * GET /api/labor-scheduling?schedules
 * Lista horarios con asignaciones
 */
const getAllSchedules = async (req, res, next) => {
    try {
        const { tipo, userId, from, to, includeInactive } = req.query;
        const filters = {
            tipo,
            userId: userId ? parseInt(userId) : null,
            from,
            to,
            includeInactive: includeInactive === 'true'
        };
        const schedules = await LaborSchedulingService.getSchedulesWithAssignments(filters);
        res.status(200).json({
            success: true,
            data: schedules,
            message: 'Horarios obtenidos exitosamente',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/labor-scheduling/:scheduleId
 * Obtiene un horario por ID
 */
const getScheduleById = async (req, res, next) => {
    try {
        const { scheduleId } = req.params;
        const schedule = await LaborSchedulingService.getScheduleById(parseInt(scheduleId));
        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Horario no encontrado',
            });
        }
        res.status(200).json({
            success: true,
            data: schedule,
            message: 'Horario obtenido exitosamente',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/labor-scheduling/recurring
 * Crea un horario recurrente
 */
const createRecurringSchedule = async (req, res, next) => {
    try {
        const schedule = await LaborSchedulingService.createRecurringSchedule(req.body);
        res.status(201).json({
            success: true,
            data: schedule,
            message: 'Horario recurrente creado exitosamente',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/labor-scheduling/one-time
 * Crea un evento único
 */
const createOneTimeEvent = async (req, res, next) => {
    try {
        const event = await LaborSchedulingService.createOneTimeEvent(req.body);
        res.status(201).json({
            success: true,
            data: event,
            message: 'Evento único creado exitosamente',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/labor-scheduling/:scheduleId/assign
 * Asigna un horario a usuarios
 */
const assignScheduleToUsers = async (req, res, next) => {
    try {
        const { scheduleId } = req.params;
        const { userIds, notes } = req.body;

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere un array de userIds',
            });
        }

        const assignments = await LaborSchedulingService.assignScheduleToUsers(
            parseInt(scheduleId),
            userIds.map(id => parseInt(id)),
            notes
        );

        res.status(201).json({
            success: true,
            data: assignments,
            message: `${assignments.length} asignaciones creadas exitosamente`,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/labor-scheduling/:scheduleId
 * Actualiza un horario
 */
const updateSchedule = async (req, res, next) => {
    try {
        const { scheduleId } = req.params;
        const schedule = await LaborSchedulingService.updateSchedule(parseInt(scheduleId), req.body);
        res.status(200).json({
            success: true,
            data: schedule,
            message: 'Horario actualizado exitosamente',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/labor-scheduling/:scheduleId
 * Elimina un horario
 */
const deleteSchedule = async (req, res, next) => {
    try {
        const { scheduleId } = req.params;
        await LaborSchedulingService.deleteSchedule(parseInt(scheduleId));
        res.status(200).json({
            success: true,
            message: 'Horario eliminado exitosamente',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    // Schedule management methods
    getAllSchedules,
    getScheduleById,
    createRecurringSchedule,
    createOneTimeEvent,
    assignScheduleToUsers,
    updateSchedule,
    deleteSchedule,
};