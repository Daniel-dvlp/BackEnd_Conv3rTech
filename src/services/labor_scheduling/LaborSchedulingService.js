const { Op } = require('sequelize');
const sequelize = require('../../config/database');
const Programacion = require('../../models/labor_scheduling/ProgramacionModel');
const Novedad = require('../../models/labor_scheduling/NovedadModel');
const User = require('../../models/users/Users');

const DAY_NAMES = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

const formatDate = (value) => {
    if (!value) return null;
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toISOString().split('T')[0];
};

const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const normalizeDias = (dias = {}) => {
    const normalized = {};
    let hasSlots = false;
    Object.entries(dias).forEach(([key, slots]) => {
        if (!Array.isArray(slots)) return;
        const dayKey = key.toLowerCase();
        const cleaned = slots
            .filter((slot) => slot.horaInicio && slot.horaFin)
            .map((slot) => {
                if (slot.horaInicio >= slot.horaFin) {
                    throw new Error(`En ${dayKey} la horaFin debe ser mayor a horaInicio`);
                }
                return {
                    horaInicio: slot.horaInicio,
                    horaFin: slot.horaFin,
                    subtitulo: slot.subtitulo || null,
                    color: slot.color || null,
                };
            });
        if (cleaned.length) {
            normalized[dayKey] = cleaned;
            hasSlots = true;
        }
    });
    if (!hasSlots) {
        throw new Error('Debe definir al menos un bloque horario en la semana');
    }
    return normalized;
};

const mapUser = (user) => {
    if (!user) return null;
    return {
        id: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo || user.email,
        documento: user.documento,
    };
};

const mapProgramacion = (programacion) => ({
    id: programacion.id_programacion,
    usuarioId: programacion.usuario_id,
    usuario: mapUser(programacion.usuario),
    fechaInicio: programacion.fecha_inicio,
    titulo: programacion.titulo,
    descripcion: programacion.descripcion,
    color: programacion.color,
    dias: programacion.dias,
    estado: programacion.estado,
    fechaCreacion: programacion.fecha_creacion,
    fechaActualizacion: programacion.fecha_actualizacion,
});

const mapNovedad = (novedad) => ({
    id: novedad.id_novedad,
    usuarioId: novedad.usuario_id,
    usuario: mapUser(novedad.usuario),
    titulo: novedad.titulo,
    fechaInicio: novedad.fecha_inicio,
    fechaFin: novedad.fecha_fin,
    allDay: novedad.all_day,
    horaInicio: novedad.hora_inicio,
    horaFin: novedad.hora_fin,
    descripcion: novedad.descripcion,
    color: novedad.color,
    estado: novedad.estado,
    fechaCreacion: novedad.fecha_creacion,
    fechaActualizacion: novedad.fecha_actualizacion,
});

const listProgramaciones = async ({ includeInactive = false, usuarioId } = {}) => {
    const where = {};
    if (!includeInactive) where.estado = 'Activa';
    if (usuarioId) where.usuario_id = usuarioId;

    const rows = await Programacion.findAll({
        where,
        include: [{ model: User, as: 'usuario' }],
        order: [['fecha_creacion', 'DESC']],
    });
    return rows.map(mapProgramacion);
};

const getProgramacionById = async (programacionId) => {
    const row = await Programacion.findByPk(programacionId, {
        include: [{ model: User, as: 'usuario' }],
    });
    return row ? mapProgramacion(row) : null;
};

const getUsuariosSinProgramacionActiva = async () => {
    const programaciones = await Programacion.findAll({
        where: { estado: 'Activa' },
        attributes: ['usuario_id'],
    });
    const ocupados = new Set(programaciones.map((p) => p.usuario_id));
    const usuarios = await User.findAll({
        attributes: ['id_usuario', 'nombre', 'apellido', 'documento', 'correo'],
        where: { estado: { [Op.ne]: 'Inactivo' } },
        order: [['nombre', 'ASC']],
    });
    return usuarios
        .filter((user) => !ocupados.has(user.id_usuario))
        .map((user) => ({
            id: user.id_usuario,
            nombre: user.nombre,
            apellido: user.apellido,
            documento: user.documento,
            correo: user.correo,
        }));
};

const createProgramaciones = async (payload) => {
    const transaction = await sequelize.transaction();
    try {
        const {
            usuarioIds = [],
            fechaInicio,
            titulo,
            descripcion = null,
            color = '#2563EB',
            dias = {},
        } = payload;

        if (!usuarioIds.length) throw new Error('Debe seleccionar al menos un usuario');
        if (!fechaInicio) throw new Error('La fecha de inicio es obligatoria');
        if (!titulo) throw new Error('El título es obligatorio');

        const normalizedDias = normalizeDias(dias);

        const existentes = await Programacion.findAll({
            where: {
                usuario_id: usuarioIds,
                estado: 'Activa',
            },
            transaction,
        });

        if (existentes.length) {
            const ids = existentes.map((item) => item.usuario_id).join(', ');
            throw new Error(`Los usuarios (${ids}) ya tienen una programación activa`);
        }

        const registros = [];
        for (const usuarioId of usuarioIds) {
            const data = await Programacion.create({
                usuario_id: usuarioId,
                fecha_inicio: fechaInicio,
                titulo,
                descripcion,
                color,
                dias: normalizedDias,
            }, { transaction });
            registros.push(data);
        }

        await transaction.commit();
        return Promise.all(registros.map((item) => getProgramacionById(item.id_programacion)));
    } catch (error) {
        await transaction.rollback();
        console.error('Error creando programaciones:', error);
        throw error;
    }
};

const updateProgramacion = async (programacionId, payload = {}) => {
    const transaction = await sequelize.transaction();
    try {
        const record = await Programacion.findByPk(programacionId, { transaction });
        if (!record) throw new Error('Programación no encontrada');

        const updates = {};
        if (payload.fechaInicio) updates.fecha_inicio = payload.fechaInicio;
        if (payload.titulo) updates.titulo = payload.titulo;
        if (payload.descripcion !== undefined) updates.descripcion = payload.descripcion;
        if (payload.color) updates.color = payload.color;
        if (payload.estado) updates.estado = payload.estado;
        if (payload.dias) updates.dias = normalizeDias(payload.dias);
        updates.fecha_actualizacion = new Date();

        await Programacion.update(updates, {
            where: { id_programacion: programacionId },
            transaction,
        });

        await transaction.commit();
        return getProgramacionById(programacionId);
    } catch (error) {
        await transaction.rollback();
        console.error('Error actualizando programación:', error);
        throw error;
    }
};

const deleteProgramacion = async (programacionId) => {
    const [count] = await Programacion.update({
        estado: 'Inactiva',
        fecha_actualizacion: new Date(),
    }, {
        where: { id_programacion: programacionId },
    });
    if (!count) throw new Error('Programación no encontrada');
    return true;
};

const listNovedades = async ({ includeInactive = false, usuarioId, from, to } = {}) => {
    const where = {};
    if (!includeInactive) where.estado = 'Activa';
    if (usuarioId) where.usuario_id = usuarioId;
    if (from || to) {
        const start = formatDate(from) || '1900-01-01';
        const end = formatDate(to) || '2999-12-31';
        where[Op.or] = [
            { fecha_inicio: { [Op.between]: [start, end] } },
            { fecha_fin: { [Op.between]: [start, end] } },
            {
                [Op.and]: [
                    { fecha_inicio: { [Op.lte]: start } },
                    { fecha_fin: { [Op.gte]: end } },
                ],
            },
        ];
    }
    const rows = await Novedad.findAll({
        where,
        include: [{ model: User, as: 'usuario' }],
        order: [['fecha_creacion', 'DESC']],
    });
    return rows.map(mapNovedad);
};

const getNovedadById = async (novedadId) => {
    const row = await Novedad.findByPk(novedadId, {
        include: [{ model: User, as: 'usuario' }],
    });
    return row ? mapNovedad(row) : null;
};

const createNovedad = async (payload) => {
    const transaction = await sequelize.transaction();
    try {
        const {
            usuarioIds = [],
            titulo,
            fechaInicio,
            fechaFin = null,
            descripcion = null,
            allDay = false,
            horaInicio = null,
            horaFin = null,
            color = '#10B981',
        } = payload;

        if (!usuarioIds.length) throw new Error('Debe seleccionar al menos un usuario');
        if (!titulo) throw new Error('El título es obligatorio');
        if (!fechaInicio) throw new Error('La fecha de inicio es obligatoria');
        if (!allDay) {
            if (!horaInicio || !horaFin) {
                throw new Error('Debe indicar hora de inicio y fin');
            }
            if (horaInicio >= horaFin) {
                throw new Error('horaFin debe ser mayor a horaInicio');
            }
        }

        const registros = [];
        for (const usuarioId of usuarioIds) {
            const data = await Novedad.create({
                usuario_id: usuarioId,
                titulo,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
                descripcion,
                all_day: allDay,
                hora_inicio: allDay ? null : horaInicio,
                hora_fin: allDay ? null : horaFin,
                color,
            }, { transaction });
            registros.push(data);
        }

        await transaction.commit();
        return Promise.all(registros.map((item) => getNovedadById(item.id_novedad)));
    } catch (error) {
        await transaction.rollback();
        console.error('Error creando novedades:', error);
        throw error;
    }
};

const updateNovedad = async (novedadId, payload = {}) => {
    const transaction = await sequelize.transaction();
    try {
        const record = await Novedad.findByPk(novedadId, { transaction });
        if (!record) throw new Error('Novedad no encontrada');

        const updates = {};
        if (payload.titulo) updates.titulo = payload.titulo;
        if (payload.descripcion !== undefined) updates.descripcion = payload.descripcion;
        if (payload.color) updates.color = payload.color;
        if (payload.estado) updates.estado = payload.estado;
        if (payload.fechaInicio) updates.fecha_inicio = payload.fechaInicio;
        if (payload.fechaFin !== undefined) updates.fecha_fin = payload.fechaFin;
        if (payload.allDay !== undefined) {
            updates.all_day = payload.allDay;
            updates.hora_inicio = payload.allDay ? null : payload.horaInicio;
            updates.hora_fin = payload.allDay ? null : payload.horaFin;
        } else {
            if (payload.horaInicio) updates.hora_inicio = payload.horaInicio;
            if (payload.horaFin) updates.hora_fin = payload.horaFin;
        }
        updates.fecha_actualizacion = new Date();

        await Novedad.update(updates, {
            where: { id_novedad: novedadId },
            transaction,
        });

        await transaction.commit();
        return getNovedadById(novedadId);
    } catch (error) {
        await transaction.rollback();
        console.error('Error actualizando novedad:', error);
        throw error;
    }
};

const deleteNovedad = async (novedadId) => {
    const [count] = await Novedad.update({
        estado: 'Inactiva',
        fecha_actualizacion: new Date(),
    }, {
        where: { id_novedad: novedadId },
    });
    if (!count) throw new Error('Novedad no encontrada');
    return true;
};

const buildProgramacionEvents = (programacion, rangeStart, rangeEnd) => {
    const events = [];
    if (!programacion.dias) return events;
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);
    const programacionStart = new Date(programacion.fecha_inicio);
    const firstDay = programacionStart > start ? programacionStart : start;

    for (let cursor = new Date(firstDay); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
        const dayName = DAY_NAMES[cursor.getDay()];
        const slots = programacion.dias[dayName];
        if (!slots || !slots.length) continue;
        const dayStr = formatDate(cursor);
        slots.forEach((slot, index) => {
            events.push({
                id: `prog-${programacion.id_programacion}-${dayStr}-${index}`,
                title: slot.subtitulo || programacion.titulo,
                start: `${dayStr}T${slot.horaInicio}`,
                end: `${dayStr}T${slot.horaFin}`,
                allDay: false,
                backgroundColor: slot.color || programacion.color,
                borderColor: slot.color || programacion.color,
                type: 'programacion',
                meta: {
                    programacionId: programacion.id_programacion,
                    usuarioId: programacion.usuario_id,
                    usuario: mapUser(programacion.usuario),
                    descripcion: programacion.descripcion,
                },
            });
        });
    }
    return events;
};

const buildNovedadEvents = (novedad, rangeStart, rangeEnd) => {
    const events = [];
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);
    const eventStart = new Date(novedad.fecha_inicio);
    const eventEnd = new Date(novedad.fecha_fin || novedad.fecha_inicio);
    if (eventEnd < start || eventStart > end) return events;

    if (novedad.all_day) {
        events.push({
            id: `nov-${novedad.id_novedad}`,
            title: novedad.titulo,
            start: formatDate(eventStart),
            end: formatDate(addDays(eventEnd, 1)),
            allDay: true,
            backgroundColor: novedad.color,
            borderColor: novedad.color,
            type: 'novedad',
            meta: {
                novedadId: novedad.id_novedad,
                usuarioId: novedad.usuario_id,
                usuario: mapUser(novedad.usuario),
                descripcion: novedad.descripcion,
            },
        });
        return events;
    }

    for (let cursor = new Date(eventStart); cursor <= eventEnd; cursor.setDate(cursor.getDate() + 1)) {
        if (cursor < start || cursor > end) continue;
        const dayStr = formatDate(cursor);
        events.push({
            id: `nov-${novedad.id_novedad}-${dayStr}`,
            title: novedad.titulo,
            start: `${dayStr}T${novedad.hora_inicio}`,
            end: `${dayStr}T${novedad.hora_fin}`,
            allDay: false,
            backgroundColor: novedad.color,
            borderColor: novedad.color,
            type: 'novedad',
            meta: {
                novedadId: novedad.id_novedad,
                usuarioId: novedad.usuario_id,
                usuario: mapUser(novedad.usuario),
                descripcion: novedad.descripcion,
            },
        });
    }
    return events;
};

const getCalendarEvents = async ({ rangeStart, rangeEnd, usuarioIds }) => {
    const start = formatDate(rangeStart);
    const end = formatDate(rangeEnd);
    if (!start || !end) throw new Error('rangeStart y rangeEnd son obligatorios');

    const programacionWhere = {
        estado: 'Activa',
        fecha_inicio: { [Op.lte]: end },
    };
    const novedadWhere = {
        estado: 'Activa',
        [Op.or]: [
            { fecha_inicio: { [Op.between]: [start, end] } },
            { fecha_fin: { [Op.between]: [start, end] } },
            {
                [Op.and]: [
                    { fecha_inicio: { [Op.lte]: start } },
                    { fecha_fin: { [Op.gte]: end } },
                ],
            },
        ],
    };

    if (usuarioIds?.length) {
        programacionWhere.usuario_id = usuarioIds;
        novedadWhere.usuario_id = usuarioIds;
    }

    const [programaciones, novedades] = await Promise.all([
        Programacion.findAll({
            where: programacionWhere,
            include: [{ model: User, as: 'usuario' }],
        }),
        Novedad.findAll({
            where: novedadWhere,
            include: [{ model: User, as: 'usuario' }],
        }),
    ]);

    const events = [];
    programaciones.forEach((programacion) => {
        events.push(...buildProgramacionEvents(programacion, start, end));
    });
    novedades.forEach((novedad) => {
        events.push(...buildNovedadEvents(novedad, start, end));
    });
    return events;
};

module.exports = {
    listProgramaciones,
    getProgramacionById,
    createProgramaciones,
    updateProgramacion,
    deleteProgramacion,
    getUsuariosSinProgramacionActiva,
    listNovedades,
    getNovedadById,
    createNovedad,
    updateNovedad,
    deleteNovedad,
    getCalendarEvents,
};

