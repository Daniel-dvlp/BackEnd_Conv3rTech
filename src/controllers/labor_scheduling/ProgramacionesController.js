const LaborSchedulingService = require('../../services/labor_scheduling/LaborSchedulingService');

const list = async (req, res, next) => {
    try {
        const includeInactive = req.query.includeInactive === 'true';
        const usuarioId = req.query.usuarioId ? parseInt(req.query.usuarioId, 10) : undefined;
        const data = await LaborSchedulingService.listProgramaciones({ includeInactive, usuarioId });
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const detail = async (req, res, next) => {
    try {
        const { programacionId } = req.params;
        const data = await LaborSchedulingService.getProgramacionById(parseInt(programacionId, 10));
        if (!data) {
            return res.status(404).json({ success: false, message: 'Programación no encontrada' });
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!Array.isArray(payload.usuarioIds) || payload.usuarioIds.length === 0) {
            return res.status(400).json({ success: false, message: 'Debe seleccionar al menos un usuario' });
        }
        if (!payload.fechaInicio) {
            return res.status(400).json({ success: false, message: 'La fecha de inicio es obligatoria' });
        }
        if (!payload.titulo) {
            return res.status(400).json({ success: false, message: 'El título es obligatorio' });
        }
        if (!payload.dias || typeof payload.dias !== 'object') {
            return res.status(400).json({ success: false, message: 'Debe enviar la estructura de días' });
        }
        const data = await LaborSchedulingService.createProgramaciones(payload);
        res.status(201).json({
            success: true,
            data,
            message: 'Programaciones creadas correctamente',
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { programacionId } = req.params;
        const data = await LaborSchedulingService.updateProgramacion(parseInt(programacionId, 10), req.body);
        res.status(200).json({ success: true, data, message: 'Programación actualizada' });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const { programacionId } = req.params;
        await LaborSchedulingService.deleteProgramacion(parseInt(programacionId, 10));
        res.status(200).json({ success: true, message: 'Programación eliminada' });
    } catch (error) {
        next(error);
    }
};

const listUsuariosDisponibles = async (req, res, next) => {
    try {
        const data = await LaborSchedulingService.getUsuariosSinProgramacionActiva();
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    list,
    detail,
    create,
    update,
    remove,
    listUsuariosDisponibles,
};

