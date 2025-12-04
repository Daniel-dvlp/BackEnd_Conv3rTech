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
    deleteSchedule,

    // Novedades
    getNovedades: async (req, res) => {
        try {
            console.log('[Novedades] getNovedades params', req.query);
            const Novedad = require('../../models/labor_scheduling/NovedadModel');
            const User = require('../../models/users/Users');
            const items = await Novedad.findAll({
                include: [{ model: User, as: 'usuario' }]
            });
            console.log('[Novedades] getNovedades count', items.length);
            const data = items.map(n => ({
                id: n.id_novedad,
                usuarioId: n.usuario_id,
                programacionId: n.programacion_id,
                titulo: n.titulo,
                fechaInicio: n.fecha_inicio,
                fechaFin: n.fecha_fin,
                horaInicio: n.hora_inicio,
                horaFin: n.hora_fin,
                allDay: n.all_day,
                descripcion: n.descripcion,
                color: n.color,
                usuario: n.usuario
            }));
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error('[Novedades] getNovedades error', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getNovedadById: async (req, res) => {
        try {
            const Novedad = require('../../models/labor_scheduling/NovedadModel');
            const User = require('../../models/users/Users');
            const { id } = req.params;
            console.log('[Novedades] getNovedadById', id);
            const n = await Novedad.findByPk(id, {
                include: [{ model: User, as: 'usuario' }]
            });
            if (!n) return res.status(404).json({ success: false, message: 'Novedad no encontrada' });
            const data = {
                id: n.id_novedad,
                usuarioId: n.usuario_id,
                programacionId: n.programacion_id,
                titulo: n.titulo,
                fechaInicio: n.fecha_inicio,
                fechaFin: n.fecha_fin,
                horaInicio: n.hora_inicio,
                horaFin: n.hora_fin,
                allDay: n.all_day,
                descripcion: n.descripcion,
                color: n.color,
                usuario: n.usuario
            };
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error('[Novedades] getNovedadById error', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    createNovedad: async (req, res) => {
        try {
            const Novedad = require('../../models/labor_scheduling/NovedadModel');
            const body = req.body;
            console.log('[Novedades] create payload', body);
            // body.usuarioIds es array, o body.usuarioId
            const uids = body.usuarioIds && Array.isArray(body.usuarioIds) ? body.usuarioIds : [body.usuarioId];
            const created = [];
            for (const uid of uids) {
                const payload = {
                    usuario_id: uid,
                    programacion_id: body.programacionId || null,
                    titulo: body.titulo,
                    fecha_inicio: body.fechaInicio,
                    fecha_fin: body.fechaFin || body.fechaInicio,
                    hora_inicio: body.horaInicio || null,
                    hora_fin: body.horaFin || null,
                    all_day: body.allDay ?? false,
                    descripcion: body.descripcion,
                    color: body.color || '#EF4444'
                };
                const newItem = await Novedad.create(payload);
                created.push(newItem);
            }
            console.log('[Novedades] create count', created.length);
            res.status(201).json({ success: true, message: 'Novedad creada', data: created });
        } catch (error) {
            console.error('[Novedades] create error', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    updateNovedad: async (req, res) => {
        try {
            const Novedad = require('../../models/labor_scheduling/NovedadModel');
            const { id } = req.params;
            const body = req.body;
            console.log('[Novedades] update', id, body);
            const item = await Novedad.findByPk(id);
            if (!item) return res.status(404).json({ success: false, message: 'Novedad no encontrada' });
            await item.update({
                titulo: body.titulo,
                fecha_inicio: body.fechaInicio,
                fecha_fin: body.fechaFin,
                hora_inicio: body.horaInicio,
                hora_fin: body.horaFin,
                all_day: body.allDay,
                descripcion: body.descripcion,
                color: body.color
            });
            console.log('[Novedades] update ok', id);
            res.status(200).json({ success: true, message: 'Novedad actualizada', data: item });
        } catch (error) {
            console.error('[Novedades] update error', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteNovedad: async (req, res) => {
        try {
            const Novedad = require('../../models/labor_scheduling/NovedadModel');
            const { id } = req.params;
            console.log('[Novedades] delete', id);
            const item = await Novedad.findByPk(id);
            if (!item) return res.status(404).json({ success: false, message: 'Novedad no encontrada' });
            await item.destroy();
            console.log('[Novedades] delete ok', id);
            res.status(200).json({ success: true, message: 'Novedad eliminada' });
        } catch (error) {
            console.error('[Novedades] delete error', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
