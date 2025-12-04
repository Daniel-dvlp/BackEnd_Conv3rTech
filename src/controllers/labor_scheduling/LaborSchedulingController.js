const LaborSchedulingRepository = require('../../repositories/labor_scheduling/LaborSchedulingRepository');

const getAllSchedules = async (req, res) => {
    try {
        const schedules = await LaborSchedulingRepository.getAllLaborSchedulings();
        const data = (schedules || []).map((s) => ({
            id: s.id_programacion,
            usuarioId: s.usuario_id,
            titulo: s.titulo,
            descripcion: s.descripcion,
            color: s.color,
            fechaInicio: s.fecha_inicio,
            dias: s.dias,
            usuario: s.usuario,
        }));
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getScheduleById = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const s = await LaborSchedulingRepository.getLaborSchedulingById(scheduleId);
        if (!s) {
            return res.status(404).json({ success: false, message: 'Programación no encontrada' });
        }
        const data = {
            id: s.id_programacion,
            usuarioId: s.usuario_id,
            titulo: s.titulo,
            descripcion: s.descripcion,
            color: s.color,
            fechaInicio: s.fecha_inicio,
            dias: s.dias,
            usuario: s.usuario,
        };
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createRecurringSchedule = async (req, res) => {
    try {
        const { usuarioIds = [], titulo, descripcion, color, fechaInicio, dias } = req.body;
        const payloads = usuarioIds.length
            ? usuarioIds.map((uid) => ({ usuario_id: uid, titulo, descripcion, color, fecha_inicio: fechaInicio, dias }))
            : [{ usuario_id: req.body.usuarioId || req.body.usuario_id, titulo, descripcion, color, fecha_inicio: fechaInicio, dias }];
        const created = [];
        for (const p of payloads) {
            const item = await LaborSchedulingRepository.createLaborScheduling(p);
            created.push({ id: item.id_programacion });
        }
        res.status(201).json({ success: true, message: 'Programación recurrente creada exitosamente', data: created });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createOneTimeEvent = async (req, res) => {
    try {
        const eventData = req.body;
        const newEvent = await LaborSchedulingRepository.createLaborScheduling(eventData);
        res.status(201).json({
            success: true,
            message: 'Evento creado exitosamente',
            data: newEvent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const assignScheduleToUsers = async (req, res) => {
    try {
        // Implement logic to assign schedule to users
        // This might involve updating the schedule or creating associations
        // For now, just returning success
        res.status(200).json({
            success: true,
            message: 'Horario asignado a usuarios correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateSchedule = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const body = req.body || {};
        const scheduleData = {
            titulo: body.titulo,
            descripcion: body.descripcion,
            color: body.color,
            fecha_inicio: body.fechaInicio || body.fecha_inicio,
            dias: body.dias,
        };
        const s = await LaborSchedulingRepository.updateLaborScheduling(scheduleId, scheduleData);
        const data = {
            id: s.id_programacion,
            usuarioId: s.usuario_id,
            titulo: s.titulo,
            descripcion: s.descripcion,
            color: s.color,
            fechaInicio: s.fecha_inicio,
            dias: s.dias,
            usuario: s.usuario,
        };
        res.status(200).json({ success: true, message: 'Programación actualizada exitosamente', data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteSchedule = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        await LaborSchedulingRepository.deleteLaborScheduling(scheduleId);
        res.status(200).json({
            success: true,
            message: 'Programación eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllSchedules,
    getScheduleById,
    createRecurringSchedule,
    createOneTimeEvent,
    assignScheduleToUsers,
    updateSchedule,
    deleteSchedule
};
