const Service = require('../../models/services/Service');

const create = async (data) => {
    return await Service.create(data);
};

const findAll = async () => {
    return await Service.findAll({ include: 'categoria' });
};

const findById = async (id) => {
    return await Service.findByPk(id, { include: 'categoria' });
};

const update = async (id, data) => {
    return await Service.update(data, { where: { id } });
};

const remove = async (id) => {
    return await Service.destroy({ where: { id } });
};

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove,
};
