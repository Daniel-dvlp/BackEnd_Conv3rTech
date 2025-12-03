const LaborSchedulingService = require('../../services/labor_scheduling/LaborSchedulingService');

const getEvents = async (req, res, next) => {
    try {
        const { rangeStart, rangeEnd, usuarioIds } = req.query;
        if (!rangeStart || !rangeEnd) {
            return res.status(400).json({
                success: false,
                message: 'Debe enviar rangeStart y rangeEnd en formato YYYY-MM-DD',
            });
        }

        // ROBUST PERMISSION CHECK: Si NO es Admin, forzar filtro por su propio usuarioId
        let enforcedUserIds = usuarioIds;
        if (req.user && req.user.id_rol !== 1) {
             // Si el usuario intenta pedir otros IDs, los ignoramos y forzamos el suyo
             enforcedUserIds = String(req.user.id_usuario);
             console.log(`🔒 [EventsController] Restringiendo eventos para usuario ${req.user.id_usuario}`);
        }

        const userFilter = enforcedUserIds
            ? enforcedUserIds.split(',').map((id) => parseInt(id, 10)).filter(Boolean)
            : undefined;

        const data = await LaborSchedulingService.getCalendarEvents({
            rangeStart,
            rangeEnd,
            usuarioIds: userFilter,
        });
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getEvents,
};

