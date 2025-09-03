const LaborSchedulingRepository = require('../../repositories/labor_scheduling/LaborSchedulingRepository');

const create = async (schedulingData) => {
    // Aquí puedes agregar validaciones o lógica de negocio
    return LaborSchedulingRepository.createLaborScheduling(schedulingData);
};

const findAll = async () => {
    return LaborSchedulingRepository.getAllLaborSchedulings();
};

const findById = async (id) => {
    return LaborSchedulingRepository.getLaborSchedulingById(id);
};

const update = async (id, schedulingData) => {
    return LaborSchedulingRepository.updateLaborScheduling(id, schedulingData);
};

const remove = async (id) => {
    return LaborSchedulingRepository.deleteLaborScheduling(id);
};

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
};