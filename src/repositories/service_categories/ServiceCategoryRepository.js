const ServiceCategory = require('../../models/services_categories/ServiceCategory');
const Service = require('../../models/services/Service');

const create = async (data) => {
    return await ServiceCategory.create(data);
};

const findAll = async () => {
    return await ServiceCategory.findAll();
};

const findById = async (id) => {
    return await ServiceCategory.findByPk(id);
};

const update = async (id, data) => {
    if (data.estado === 'inactivo') {
        const activeServicesCount = await Service.count({
            where: {
                id_categoria_servicio: id,
                estado: 'activo'
            }
        });
        if (activeServicesCount > 0) {
            throw new Error("Error, no puedes desactivar esta categoría porque tiene servicios asociados activos.");
        }
    }
    return await ServiceCategory.update(data, { where: { id } });
};

const remove = async (id) => {
    const servicesCount = await Service.count({ where: { id_categoria_servicio: id } });
    if (servicesCount > 0) {
        throw new Error("Error, no puedes eliminar esta categoría porque tiene servicios asociados.");
    }
    return await ServiceCategory.destroy({ where: { id } });
};

const changeState = async (id, state) => {
    if (state === 'inactivo') {
        const activeServicesCount = await Service.count({
            where: {
                id_categoria_servicio: id,
                estado: 'activo'
            }
        });
        if (activeServicesCount > 0) {
            throw new Error("Error, no puedes desactivar esta categoría porque tiene servicios asociados activos.");
        }
    }
    return await ServiceCategory.update({ estado: state }, { where: { id } });
};

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove,
    changeState
};