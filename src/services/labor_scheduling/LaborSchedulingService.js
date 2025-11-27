const { Op } = require('sequelize');
const User = require('../../models/users/Users');
const Schedule = require('../../models/labor_scheduling/ScheduleModel');
const UserScheduleAssignment = require('../../models/labor_scheduling/UserScheduleAssignmentModel');
const sequelize = require('../../config/database');

/**
 * Formatea un horario para el frontend
 */
const formatScheduleForFrontend = (schedule, assignments = []) => {
    const assignmentMap = assignments.reduce((acc, assignment) => {
        acc[assignment.id_usuario] = assignment;
        return acc;
    }, {});

    return {
        id: schedule.id_schedule,
        tipo: schedule.tipo,
        fecha_inicio: schedule.fecha_inicio,
        recurrencia_semanal: schedule.recurrencia_semanal,
        fecha: schedule.fecha,
        fecha_fin: schedule.fecha_fin,
        observacion: schedule.observacion,
        hora_inicio: schedule.hora_inicio,
        hora_fin: schedule.hora_fin,
        color: schedule.color,
        estado: schedule.estado,
        fecha_creacion: schedule.fecha_creacion,
        fecha_actualizacion: schedule.fecha_actualizacion,
        assignments: assignments.map(assignment => ({
            id: assignment.id_asignacion,
            userId: assignment.id_usuario,
            estado: assignment.estado,
            notas_asignacion: assignment.notas_asignacion,
            fecha_creacion: assignment.fecha_creacion,
            fecha_actualizacion: assignment.fecha_actualizacion,
            user: assignment.user ? {
                id: assignment.user.id_usuario,
                nombre: assignment.user.nombre,
                apellido: assignment.user.apellido,
                email: assignment.user.email
            } : null
        }))
    };
};

/**
 * Crea un horario recurrente
 */
const createRecurringSchedule = async (scheduleData) => {
    const transaction = await sequelize.transaction();
    try {
        const {
            fecha_inicio,
            recurrencia_semanal,
            hora_inicio,
            hora_fin,
            color = '#3B82F6',
            userIds = []
        } = scheduleData;

        // Validar fecha de inicio
        if (new Date(fecha_inicio) < new Date()) {
            throw new Error('La fecha de inicio no puede ser en el pasado');
        }

        // Validar recurrencia semanal
        if (!recurrencia_semanal || !Array.isArray(recurrencia_semanal) || recurrencia_semanal.length === 0) {
            throw new Error('Se requiere al menos un día de la semana para horarios recurrentes');
        }

        // Crear el horario
        const schedule = await Schedule.create({
            tipo: 'recurring',
            fecha_inicio,
            recurrencia_semanal,
            hora_inicio,
            hora_fin,
            color
        }, { transaction });

        // Asignar usuarios si se proporcionan
        if (userIds && userIds.length > 0) {
            const assignments = userIds.map(userId => ({
                id_horario: schedule.id_schedule,
                id_usuario: userId
            }));
            await UserScheduleAssignment.bulkCreate(assignments, { transaction });
        }

        await transaction.commit();

        // Obtener el horario con asignaciones
        return await getScheduleById(schedule.id_schedule);
    } catch (error) {
        await transaction.rollback();
        console.error('Error creando horario recurrente:', error);
        throw new Error(`Error al crear horario recurrente: ${error.message}`);
    }
};

/**
 * Crea un evento único
 */
const createOneTimeEvent = async (eventData) => {
    const transaction = await sequelize.transaction();
    try {
        const {
            fecha,
            fecha_fin = null,
            observacion,
            hora_inicio,
            hora_fin,
            color = '#10B981',
            userIds = []
        } = eventData;

        // Validar fecha
        if (new Date(fecha) < new Date()) {
            throw new Error('La fecha del evento no puede ser en el pasado');
        }

        // Validar observación
        if (!observacion || observacion.trim().length === 0) {
            throw new Error('Se requiere una observación para eventos únicos');
        }

        // Crear el evento
        const schedule = await Schedule.create({
            tipo: 'one-time',
            fecha,
            fecha_fin,
            observacion: observacion.trim(),
            hora_inicio,
            hora_fin,
            color
        }, { transaction });

        // Asignar usuarios si se proporcionan
        if (userIds && userIds.length > 0) {
            const assignments = userIds.map(userId => ({
                id_horario: schedule.id_schedule,
                id_usuario: userId
            }));
            await UserScheduleAssignment.bulkCreate(assignments, { transaction });
        }

        await transaction.commit();

        // Obtener el evento con asignaciones
        return await getScheduleById(schedule.id_schedule);
    } catch (error) {
        await transaction.rollback();
        console.error('Error creando evento único:', error);
        throw new Error(`Error al crear evento único: ${error.message}`);
    }
};

/**
 * Asigna un horario a usuarios
 */
const assignScheduleToUsers = async (scheduleId, userIds, notes = null) => {
    const transaction = await sequelize.transaction();
    try {
        // Verificar que el horario existe
        const schedule = await Schedule.findByPk(scheduleId, { transaction });
        if (!schedule) {
            throw new Error('Horario no encontrado');
        }

        const assignments = [];

        for (const userId of userIds) {
            // Verificar si ya existe asignación
            const existing = await UserScheduleAssignment.findOne({
                where: {
                    id_horario: scheduleId,
                    id_usuario: userId
                },
                transaction
            });

            if (!existing) {
                const assignment = await UserScheduleAssignment.create({
                    id_horario: scheduleId,
                    id_usuario: userId,
                    notas_asignacion: notes
                }, { transaction });
                assignments.push(assignment);
            }
        }

        await transaction.commit();

        // Obtener asignaciones con información de usuario
        const fullAssignments = await UserScheduleAssignment.findAll({
            where: { id_horario: scheduleId },
            include: [{
                model: User,
                as: 'user'
            }],
            order: [['fecha_creacion', 'DESC']]
        });

        return fullAssignments;
    } catch (error) {
        await transaction.rollback();
        console.error('Error asignando horario a usuarios:', error);
        throw new Error(`Error al asignar horario a usuarios: ${error.message}`);
    }
};

/**
 * Obtiene horarios con asignaciones
 */
const getSchedulesWithAssignments = async (filters = {}) => {
    try {
        const {
            tipo,
            estado = 'Activo',
            userId,
            from,
            to,
            includeInactive = false
        } = filters;

        const whereClause = {};

        if (tipo) whereClause.tipo = tipo;
        if (!includeInactive) whereClause.estado = estado;

        // Filtros de fecha
        if (from || to) {
            whereClause[Op.or] = [];

            // Para horarios recurrentes
            const recurringCondition = { tipo: 'recurring' };
            if (from) recurringCondition.fecha_inicio = { [Op.gte]: from };
            if (to) {
                if (!recurringCondition.fecha_inicio) recurringCondition.fecha_inicio = {};
                recurringCondition.fecha_inicio[Op.lte] = to;
            }
            if (Object.keys(recurringCondition).length > 1) {
                whereClause[Op.or].push(recurringCondition);
            }

            // Para eventos únicos
            const oneTimeCondition = { tipo: 'one-time' };
            if (from) oneTimeCondition.fecha = { [Op.gte]: from };
            if (to) {
                if (!oneTimeCondition.fecha) oneTimeCondition.fecha = {};
                oneTimeCondition.fecha[Op.lte] = to;
            }
            if (Object.keys(oneTimeCondition).length > 1) {
                whereClause[Op.or].push(oneTimeCondition);
            }
        }

        const schedules = await Schedule.findAll({
            where: whereClause,
            include: [{
                model: UserScheduleAssignment,
                as: 'assignments',
                include: [{
                    model: User,
                    as: 'user'
                }],
                required: false
            }],
            order: [['fecha_creacion', 'DESC']]
        });

        // Filtrar por usuario si se especifica
        let filteredSchedules = schedules;
        if (userId) {
            filteredSchedules = schedules.filter(schedule =>
                schedule.assignments.some(assignment => assignment.id_usuario === parseInt(userId))
            );
        }

        return filteredSchedules.map(schedule => formatScheduleForFrontend(schedule, schedule.assignments));
    } catch (error) {
        console.error('Error obteniendo horarios:', error);
        throw new Error(`Error al obtener horarios: ${error.message}`);
    }
};

/**
 * Obtiene un horario por ID
 */
const getScheduleById = async (scheduleId) => {
    try {
        const schedule = await Schedule.findByPk(scheduleId, {
            include: [{
                model: UserScheduleAssignment,
                as: 'assignments',
                include: [{
                    model: User,
                    as: 'user'
                }]
            }]
        });

        if (!schedule) {
            return null;
        }

        return formatScheduleForFrontend(schedule, schedule.assignments);
    } catch (error) {
        console.error('Error obteniendo horario:', error);
        throw new Error(`Error al obtener horario: ${error.message}`);
    }
};

/**
 * Actualiza un horario
 */
const updateSchedule = async (scheduleId, updateData) => {
    const transaction = await sequelize.transaction();
    try {
        const schedule = await Schedule.findByPk(scheduleId, { transaction });
        if (!schedule) {
            throw new Error('Horario no encontrado');
        }

        const {
            fecha_inicio,
            recurrencia_semanal,
            fecha,
            fecha_fin,
            observacion,
            hora_inicio,
            hora_fin,
            color,
            estado
        } = updateData;

        // Validaciones según tipo
        if (schedule.tipo === 'recurring') {
            if (fecha_inicio && new Date(fecha_inicio) < new Date()) {
                throw new Error('La fecha de inicio no puede ser en el pasado');
            }
            if (recurrencia_semanal && (!Array.isArray(recurrencia_semanal) || recurrencia_semanal.length === 0)) {
                throw new Error('Se requiere al menos un día de la semana para horarios recurrentes');
            }
        } else if (schedule.tipo === 'one-time') {
            if (fecha && new Date(fecha) < new Date()) {
                throw new Error('La fecha del evento no puede ser en el pasado');
            }
            if (observacion !== undefined && (!observacion || observacion.trim().length === 0)) {
                throw new Error('Se requiere una observación para eventos únicos');
            }
        }

        // Actualizar horario
        await Schedule.update({
            fecha_inicio,
            recurrencia_semanal,
            fecha,
            fecha_fin,
            observacion: observacion ? observacion.trim() : observacion,
            hora_inicio,
            hora_fin,
            color,
            estado,
            fecha_actualizacion: new Date()
        }, {
            where: { id_schedule: scheduleId },
            transaction
        });

        await transaction.commit();

        // Retornar horario actualizado
        return await getScheduleById(scheduleId);
    } catch (error) {
        await transaction.rollback();
        console.error('Error actualizando horario:', error);
        throw new Error(`Error al actualizar horario: ${error.message}`);
    }
};

/**
 * Elimina un horario (desactivación lógica)
 */
const deleteSchedule = async (scheduleId) => {
    const transaction = await sequelize.transaction();
    try {
        const schedule = await Schedule.findByPk(scheduleId, { transaction });
        if (!schedule) {
            throw new Error('Horario no encontrado');
        }

        // Desactivar horario
        await Schedule.update({
            estado: 'Inactivo',
            fecha_actualizacion: new Date()
        }, {
            where: { id_schedule: scheduleId },
            transaction
        });

        // Desactivar asignaciones (opcional - mantener historial)
        await UserScheduleAssignment.update({
            estado: 'Rechazado',
            fecha_actualizacion: new Date()
        }, {
            where: { id_horario: scheduleId },
            transaction
        });

        await transaction.commit();
        return { success: true, message: 'Horario eliminado exitosamente' };
    } catch (error) {
        await transaction.rollback();
        console.error('Error eliminando horario:', error);
        throw new Error(`Error al eliminar horario: ${error.message}`);
    }
};

/**
 * Obtiene horarios asignados a un usuario específico
 */
const getSchedulesByUser = async (userId) => {
    try {
        const schedules = await Schedule.findAll({
            include: [{
                model: UserScheduleAssignment,
                as: 'assignments',
                where: { id_usuario: userId },
                required: true,
                include: [{
                    model: User,
                    as: 'user'
                }]
            }],
            where: { estado: 'Activo' },
            order: [['fecha_creacion', 'DESC']]
        });

        return schedules.map(schedule => formatScheduleForFrontend(schedule, schedule.assignments));
    } catch (error) {
        console.error('Error obteniendo horarios por usuario:', error);
        throw new Error(`Error al obtener horarios por usuario: ${error.message}`);
    }
};

/**
 * Obtiene eventos asignados a un usuario específico
 */
const getEventsByUser = async (userId) => {
    try {
        const events = await Schedule.findAll({
            include: [{
                model: UserScheduleAssignment,
                as: 'assignments',
                where: { id_usuario: userId },
                required: true,
                include: [{
                    model: User,
                    as: 'user'
                }]
            }],
            where: {
                tipo: 'one-time',
                estado: 'Activo'
            },
            order: [['fecha_creacion', 'DESC']]
        });

        return events.map(event => formatScheduleForFrontend(event, event.assignments));
    } catch (error) {
        console.error('Error obteniendo eventos por usuario:', error);
        throw new Error(`Error al obtener eventos por usuario: ${error.message}`);
    }
};

module.exports = {
    // Schedule management methods
    createRecurringSchedule,
    createOneTimeEvent,
    assignScheduleToUsers,
    getSchedulesWithAssignments,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
    // User-specific methods
    getSchedulesByUser,
    getEventsByUser,
};