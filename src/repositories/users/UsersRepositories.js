const User= require('../../models/users/Users');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const createUser = async (user) => {
    // Encriptar contraseña
    const saltRounds = 12;
    user.contrasena = await bcrypt.hash(user.contrasena, saltRounds);
    return User.create(user);
}

const getAllUsers = async () => {
    return User.findAll({
        include: [
            {
                model: require('../../models/roles/roles'),
                as: 'rol',
                attributes: ['id_rol', 'nombre_rol', 'descripcion']
            },
        ],
        attributes: { exclude: ['contrasena'] }
    });
}

const getUserById = async (id) => {
    return User.findByPk(id, {
        include: [
            {
                model: require('../../models/roles/roles'),
                as: 'rol',
                attributes: ['id_rol', 'nombre_rol', 'descripcion']
            }
        ]
    });
}

const updateUser = async (id, userData) => {
    // Si hay contraseña, encriptarla
    if (userData.contrasena) {
        const saltRounds = 12;
        userData.contrasena = await bcrypt.hash(userData.contrasena, saltRounds);
    }
    return User.update(userData, { where: { id_usuario: id } });
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
        { estado_usuario: { [likeOperator]: `%${searchTerm}%` } },
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