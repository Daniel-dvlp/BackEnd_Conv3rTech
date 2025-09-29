const Service = require('../../models/services/Service');

const createService = async (data) => {
    return await Service.create(data);
};

const getAllServices = async () => {
    return await Service.findAll({ include: 'categoria' });
};

const getServiceById = async (id) => {
    return await Service.findOne({
        where: { id_servicio: id },
        include: 'categoria'
    });
};

const updateService = async (id, data) => {
    // Primero verificar que el servicio existe
    const existingService = await Service.findOne({ where: { id_servicio: id } });
    if (!existingService) {
        throw new Error('Servicio no encontrado');
    }
    
    // Actualizar el servicio
    await Service.update(data, { where: { id_servicio: id } });
    
    // Retornar el servicio actualizado con la categoría
    return await Service.findOne({ 
        where: { id_servicio: id }, 
        include: 'categoria' 
    });
};

const deleteService = async (id) => {
    return await Service.destroy({ where: { id_servicio: id } });
};

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
};
