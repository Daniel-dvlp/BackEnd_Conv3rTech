const User= require('../../models/users/Users');
const { Op } = require('sequelize');

const createUser= async (user) => {
    return User.create(user);
}

const getAllUsers = async () => {
    return User.findAll();
}

const getUserById = async (id) => {
    return User.findByPk(id);
}

const updateUser = async (id, userData) => {
    return User.update(userData,{ where: { id } });
}

const deleteUser = async (id) => {
    return User.destroy({ where: {  id_usuario: id } });
}

const searchUsers = async (term) => {
    const searchTerm = (term || '').trim();
    if (searchTerm.length === 0) {
        return User.findAll();
    }

    const likeOperator = User.sequelize.getDialect && User.sequelize.getDialect() === 'postgres' ? Op.iLike : Op.like;

    const orConditions = [
        { documento: { [likeOperator]: `%${searchTerm}%` } },
        { tipo_documento: { [likeOperator]: `%${searchTerm}%` } },
        { nombre: { [likeOperator]: `%${searchTerm}%` } },
        { apellido: { [likeOperator]: `%${searchTerm}%` } },
        { celular: { [likeOperator]: `%${searchTerm}%` } },
        { correo: { [likeOperator]: `%${searchTerm}%` } },
        { id_rol: { [likeOperator]: `%${searchTerm}%` } },
        { id_estado_usuario: { [likeOperator]: `%${searchTerm}%` } },
    ];

    const parsedId = Number(searchTerm);
    if (!Number.isNaN(parsedId)) {
        orConditions.push({ id_usuario: parsedId });
    }

    return User.findAll({ where: { [Op.or]: orConditions } });
}


module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers
};