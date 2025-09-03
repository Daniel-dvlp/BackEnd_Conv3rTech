const LaborSchedulingService = require('../../services/labor_scheduling/LaborSchedulingService');

const createScheduling = async (req, res, next) => {
    try {
        const scheduling = await LaborSchedulingService.create(req.body);
        res.status(201).json(scheduling);
    } catch (error) {
        next(error);
    }
};

const getAllSchedulings = async (req, res, next) => {
    try {
        const schedulings = await LaborSchedulingService.findAll();
        res.status(200).json(schedulings);
    } catch (error) {
        next(error);
    }
};

const getSchedulingById = async (req, res, next) => {
    try {
        const scheduling = await LaborSchedulingService.findById(req.params.id);
        if (!scheduling) {
            return res.status(404).json({ message: 'Programación laboral no encontrada' });
        }
        res.status(200).json(scheduling);
    } catch (error) {
        next(error);
    }
};

const updateScheduling = async (req, res, next) => {
    try {
        const scheduling = await LaborSchedulingService.update(req.params.id, req.body);
        res.status(200).json(scheduling);
    } catch (error) {
        next(error);
    }
};

const deleteScheduling = async (req, res, next) => {
    try {
        await LaborSchedulingService.remove(req.params.id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createScheduling,
    getAllSchedulings,
    getSchedulingById,
    updateScheduling,
    deleteScheduling
};