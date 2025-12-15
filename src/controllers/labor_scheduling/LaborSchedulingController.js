const LaborSchedulingRepository = require('../../repositories/labor_scheduling/LaborSchedulingRepository');
const User = require('../../models/users/Users');
const { Op } = require('sequelize');

const getAllSchedules = async (req, res) => {
    try {
        const filters = {};
        // Si es Técnico (2), solo ve su programación
        if (req.user && req.user.id_rol === 2) {
            filters.usuario_id = req.user.id_usuario;
        }
        
        // Filtro para ver anuladas
        if (req.query.includeAnnulled === 'true') {
            filters.includeAnnulled = true;
        }

        const schedules = await LaborSchedulingRepository.getAllLaborSchedulings(filters);
        
        const data = (schedules || []).map((s) => ({
            id: s.id_programacion,
            usuarioId: s.usuario_id,
            titulo: s.titulo,
            descripcion: s.descripcion,
            color: s.color,
            fechaInicio: s.fecha_inicio,
            fechaFin: s.fecha_fin,
            dias: s.dias,
            usuario: s.usuario,
            estado: s.estado,
            motivoAnulacion: s.motivo_anulacion
        }));
        
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('[LaborSchedulingController] getAllSchedules error:', error);
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
        
        // Validación de permisos: Técnico solo ve su propia programación
        if (req.user.id_rol === 2 && s.usuario_id !== req.user.id_usuario) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para ver esta programación' });
        }

        const data = {
            id: s.id_programacion,
            usuarioId: s.usuario_id,
            titulo: s.titulo,
            descripcion: s.descripcion,
            color: s.color,
            fechaInicio: s.fecha_inicio,
            fechaFin: s.fecha_fin,
            dias: s.dias,
            usuario: s.usuario,
            estado: s.estado,
            motivoAnulacion: s.motivo_anulacion
        };
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createRecurringSchedule = async (req, res) => {
    try {
        // Solo Admin (1) y Coordinador (3) pueden crear
        if (req.user && ![1, 3].includes(req.user.id_rol)) {
            return res.status(403).json({ success: false, message: "No tienes permisos para crear programación." });
        }

        const { usuarioIds = [], titulo, descripcion, color, fechaInicio, fechaFin, dias } = req.body;
        
        // Normalizar IDs de usuarios
        const targetUserIds = usuarioIds.length > 0 
            ? usuarioIds 
            : [req.body.usuarioId || req.body.usuario_id].filter(id => id);

        if (targetUserIds.length === 0) {
            return res.status(400).json({ success: false, message: "Debe seleccionar al menos un usuario." });
        }

        // Validación: Verificar usuarios inactivos
        const inactiveUsers = await User.findAll({
            where: {
                id_usuario: targetUserIds,
                estado_usuario: { [Op.ne]: 'Activo' }
            }
        });

        if (inactiveUsers.length > 0) {
            const names = inactiveUsers.map(u => `${u.nombre} ${u.apellido}`).join(', ');
            return res.status(400).json({ 
                success: false, 
                message: `No se puede crear programación para usuarios inactivos: ${names}` 
            });
        }

        // Crear programaciones
        const created = [];
        for (const uid of targetUserIds) {
            const payload = {
                usuario_id: uid,
                titulo,
                descripcion,
                color,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin || null,
                dias // Se guarda tal cual como JSON
            };
            const item = await LaborSchedulingRepository.createLaborScheduling(payload);
            created.push({ id: item.id_programacion });
        }
        
        res.status(201).json({ success: true, message: 'Programación recurrente creada exitosamente', data: created });
    } catch (error) {
        console.error('[LaborSchedulingController] createRecurringSchedule error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateSchedule = async (req, res) => {
    try {
        // Solo Admin (1) y Coordinador (3) pueden editar
        if (req.user && ![1, 3].includes(req.user.id_rol)) {
            return res.status(403).json({ success: false, message: "No tienes permisos para editar programación." });
        }

        const { scheduleId } = req.params;
        const body = req.body || {};
        
        const scheduleData = {
            titulo: body.titulo,
            descripcion: body.descripcion,
            color: body.color,
            fecha_inicio: body.fechaInicio || body.fecha_inicio,
            fecha_fin: body.fechaFin || body.fecha_fin || null,
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
            fechaFin: s.fecha_fin,
            dias: s.dias,
            usuario: s.usuario,
        };
        
        res.status(200).json({ success: true, message: 'Programación actualizada exitosamente', data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const annulSchedule = async (req, res) => {
    try {
        // Solo Admin (1) y Coordinador (3) pueden anular
        if (req.user && ![1, 3].includes(req.user.id_rol)) {
            return res.status(403).json({ success: false, message: "No tienes permisos para anular programación." });
        }

        const { id } = req.params;
        const { motivo } = req.body;
        
        if (!motivo || motivo.trim() === '') {
            return res.status(400).json({ success: false, message: 'El motivo de anulación es obligatorio.' });
        }

        const annulled = await LaborSchedulingRepository.annulLaborScheduling(id, motivo);
        
        res.status(200).json({
            success: true,
            message: 'Programación anulada exitosamente',
            data: annulled
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteSchedule = async (req, res) => {
    try {
        // Solo Admin (1) puede eliminar físicamente
        if (req.user && req.user.id_rol !== 1) {
            return res.status(403).json({ success: false, message: "Solo administradores pueden eliminar registros." });
        }

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

// --- NOVEDADES ---

const getNovedades = async (req, res) => {
    try {
        const Novedad = require('../../models/labor_scheduling/NovedadModel');
        const { usuarioId, from, to, includeInactive } = req.query || {};
        const where = {};
        
        // Filtro de usuario: Técnico solo ve lo suyo, Admin puede filtrar
        if (req.user.id_rol === 2) {
            where.usuario_id = req.user.id_usuario;
        } else if (usuarioId) {
            where.usuario_id = Number(usuarioId);
        }

        if (!includeInactive) where.estado = 'Activa';
        
        if (from && to) {
            Object.assign(where, {
                [Op.or]: [
                    { fecha_inicio: { [Op.between]: [from, to] } },
                    { fecha_fin: { [Op.between]: [from, to] } },
                    { fecha_inicio: { [Op.lte]: from }, fecha_fin: { [Op.gte]: to } },
                ],
            });
        }
        
        const items = await Novedad.findAll({ 
            include: [{ model: User, as: 'usuario', attributes: ['id_usuario', 'nombre', 'apellido', 'documento', 'tipo_documento'] }], 
            where,
            order: [['fecha_inicio', 'DESC']]
        });
        
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
            usuario: n.usuario,
            estado: n.estado,
            motivoAnulacion: n.motivo_anulacion
        }));
        
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('[Novedades] getNovedades error', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const createNovedad = async (req, res) => {
    try {
        // Solo Admin (1) y Coordinador (3)
        if (req.user && ![1, 3].includes(req.user.id_rol)) {
            return res.status(403).json({ success: false, message: "No tienes permisos para crear novedades." });
        }

        const Novedad = require('../../models/labor_scheduling/NovedadModel');
        const body = req.body;
        
        const uids = body.usuarioIds && Array.isArray(body.usuarioIds) ? body.usuarioIds : [body.usuarioId];
        const validUserIds = uids.filter(id => id);

        if (validUserIds.length === 0) {
            return res.status(400).json({ success: false, message: "Debe seleccionar al menos un usuario." });
        }
        
        // Validación de usuarios inactivos
        const inactiveUsers = await User.findAll({
            where: {
                id_usuario: validUserIds,
                estado_usuario: { [Op.ne]: 'Activo' }
            }
        });

        if (inactiveUsers.length > 0) {
            const names = inactiveUsers.map(u => `${u.nombre} ${u.apellido}`).join(', ');
            return res.status(400).json({ 
                success: false, 
                message: `No se puede crear novedad para usuarios inactivos: ${names}` 
            });
        }

        const created = [];
        for (const uid of validUserIds) {
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
        
        res.status(201).json({ success: true, message: 'Novedad creada', data: created });
    } catch (error) {
        console.error('[Novedades] create error', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getNovedadById = async (req, res) => {
    try {
        const Novedad = require('../../models/labor_scheduling/NovedadModel');
        const { id } = req.params;
        
        const n = await Novedad.findByPk(id, {
            include: [{ model: User, as: 'usuario', attributes: ['id_usuario', 'nombre', 'apellido', 'documento', 'tipo_documento'] }]
        });
        
        if (!n) return res.status(404).json({ success: false, message: 'Novedad no encontrada' });
        
        // Validación Rol Técnico
        if (req.user.id_rol === 2 && n.usuario_id !== req.user.id_usuario) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para ver esta novedad' });
        }

        const data = {
            id: n.id_novedad,
            usuarioId: n.usuario_id,
            titulo: n.titulo,
            fechaInicio: n.fecha_inicio,
            fechaFin: n.fecha_fin,
            horaInicio: n.hora_inicio,
            horaFin: n.hora_fin,
            allDay: n.all_day,
            descripcion: n.descripcion,
            color: n.color,
            usuario: n.usuario,
            estado: n.estado,
            motivoAnulacion: n.motivo_anulacion
        };
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteNovedad = async (req, res) => {
    try {
        if (req.user && req.user.id_rol !== 1) {
            return res.status(403).json({ success: false, message: "Solo administradores pueden eliminar novedades." });
        }
        const Novedad = require('../../models/labor_scheduling/NovedadModel');
        const { id } = req.params;
        const n = await Novedad.findByPk(id);
        if (!n) return res.status(404).json({ success: false, message: 'Novedad no encontrada' });
        await n.destroy();
        res.status(200).json({ success: true, message: 'Novedad eliminada' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateNovedad = async (req, res) => {
    try {
        // Implementar lógica de actualización si es necesaria
        // Por ahora solo anulación vía 'estado' si se implementa endpoint específico
        // Este es un placeholder para evitar errores si la ruta existe
        res.status(501).json({ success: false, message: 'Método no implementado aún' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createOneTimeEvent = async (req, res) => {
    // Reutiliza createLaborScheduling pero para un solo día/evento si es necesario
    // De momento redirigimos a createRecurringSchedule con un solo día
    return createRecurringSchedule(req, res);
};

const assignScheduleToUsers = async (req, res) => {
    res.status(200).json({ success: true, message: 'Funcionalidad legacy' });
};

module.exports = {
    getAllSchedules,
    getScheduleById,
    createRecurringSchedule,
    createOneTimeEvent,
    assignScheduleToUsers,
    annulSchedule,
    updateSchedule,
    deleteSchedule,
    getNovedades,
    getNovedadById,
    createNovedad,
    deleteNovedad,
    updateNovedad
};