const ServiceCategory = require('../../models/services_categories/ServiceCategory');

// Se ha eliminado la importación de 'Service' para independizar el módulo.

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
    return await ServiceCategory.update(data, { where: { id } });
};

// **FUNCIÓN MODIFICADA**
const remove = async (id) => {
    // Se elimina la categoría directamente sin validar si tiene servicios asociados.
    // Esta es la versión independiente que solicitaste.
    return await ServiceCategory.destroy({ where: { id } });
};

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove,
};