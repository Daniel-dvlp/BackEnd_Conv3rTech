const User= require('../../models/users/Users');

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

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};