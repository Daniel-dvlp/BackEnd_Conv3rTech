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
        const userFilter = usuarioIds
            ? usuarioIds.split(',').map((id) => parseInt(id, 10)).filter(Boolean)
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

