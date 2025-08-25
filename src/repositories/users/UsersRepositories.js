const User = require('../../models/users/Users');
const bcrypt = require('bcryptjs');

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
            {
                model: require('../../models/estado_usuarios/estado_usuarios'),
                as: 'estado',
                attributes: ['id_estado_usuario', 'estado']
            }
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
            },
            {
                model: require('../../models/estado_usuarios/estado_usuarios'),
                as: 'estado',
                attributes: ['id_estado_usuario', 'estado']
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

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};