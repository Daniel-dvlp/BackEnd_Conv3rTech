const LaborScheduling = require('../../models/labor_scheduling/LaborSchedulingModel');
const User = require('../../models/users/Users');

const createLaborScheduling = async (schedulingData) => {
    return LaborScheduling.create(schedulingData);
};

const getAllLaborSchedulings = async () => {
    return LaborScheduling.findAll({
        include: [{
            model: User,
            as: 'user'
        }]
    });
};

const getLaborSchedulingById = async (id) => {
    return LaborScheduling.findByPk(id, {
        include: [{
            model: User,
            as: 'user'
        }]
    });
};

const updateLaborScheduling = async (id, schedulingData) => {
    const scheduling = await LaborScheduling.findByPk(id);
    if (!scheduling) {
        throw new Error('Programación laboral no encontrada');
    }
    return scheduling.update(schedulingData);
};

const deleteLaborScheduling = async (id) => {
    const scheduling = await LaborScheduling.findByPk(id);
    if (!scheduling) {
        throw new Error('Programación laboral no encontrada');
    }
    return scheduling.destroy();
};

module.exports = {
    createLaborScheduling,
    getAllLaborSchedulings,
    getLaborSchedulingById,
    updateLaborScheduling,
    deleteLaborScheduling
};