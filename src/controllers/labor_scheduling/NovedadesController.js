const LaborSchedulingService = require('../../services/labor_scheduling/LaborSchedulingService');

/**
 * GET /api/novedades
 * Lista novedades (eventos únicos)
 */
const getAllNovedades = async (req, res, next) => {
    try {
        const { usuarioId, from, to, includeInactive } = req.query;
        const filtros = {
            usuarioId: usuarioId ? parseInt(usuarioId, 10) : undefined,
            from,
            to,
            includeInactive: includeInactive === 'true',
        };
        const data = await LaborSchedulingService.listNovedades(filtros);
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/novedades/:novedadId
 * Obtiene una novedad por ID
 */
const getNovedadById = async (req, res, next) => {
    try {
        const { novedadId } = req.params;
        const data = await LaborSchedulingService.getNovedadById(parseInt(novedadId, 10));
        if (!data) {
            return res.status(404).json({ success: false, message: 'Novedad no encontrada' });
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/novedades
 * Crea una nueva novedad
 */
const createNovedad = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!Array.isArray(payload.usuarioIds) || payload.usuarioIds.length === 0) {
            return res.status(400).json({ success: false, message: 'Debe seleccionar al menos un usuario' });
        }
        if (!payload.titulo) {
            return res.status(400).json({ success: false, message: 'El título es obligatorio' });
        }
        if (!payload.fechaInicio) {
            return res.status(400).json({ success: false, message: 'La fecha de inicio es obligatoria' });
        }
        if (!payload.allDay && (!payload.horaInicio || !payload.horaFin)) {
            return res.status(400).json({ success: false, message: 'Debe indicar hora de inicio y fin' });
        }
        const data = await LaborSchedulingService.createNovedad(payload);
        res.status(201).json({ success: true, data, message: 'Novedades creadas' });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/novedades/:novedadId
 * Actualiza una novedad
 */
const updateNovedad = async (req, res, next) => {
    try {
        const { novedadId } = req.params;
        const data = await LaborSchedulingService.updateNovedad(parseInt(novedadId, 10), req.body);
        res.status(200).json({ success: true, data, message: 'Novedad actualizada' });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/novedades/:novedadId
 * Elimina una novedad
 */
const deleteNovedad = async (req, res, next) => {
    try {
        const { novedadId } = req.params;
        await LaborSchedulingService.deleteNovedad(parseInt(novedadId));
        res.status(200).json({
            success: true,
            message: 'Novedad eliminada exitosamente',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllNovedades,
    getNovedadById,
    createNovedad,
    updateNovedad,
    deleteNovedad
};
