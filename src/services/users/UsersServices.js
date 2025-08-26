const UserRepository = require('../../repositories/users/UsersRepositories');

const createUser = async (userData) => {
    return UserRepository.createUser(userData);
}

const getAllUsers = async () => {
    return UserRepository.getAllUsers();
}

const getUserById = async (id) => {
    return UserRepository.getUserById(id);
}

const updateUser = async (id, userData) => {
    return UserRepository.updateUser(id, userData);
}

const deleteUser = async (id) => {
    return UserRepository.deleteUser(id);
}

const searchUsers = async (term) => {
    return UserRepository.searchUsers(term);
}

module.exports = {
    createUser, 
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers
};