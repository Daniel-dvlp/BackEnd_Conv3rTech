const { validationResult } = require("express-validator");
const UsersServices = require('../../services/users/UsersServices');
const Users = require('../../models/users/Users');

const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await UsersServices.createUser(req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await UsersServices.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await UsersServices.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const [updated] = await Users.update(req.body, { where: { id_usuario: id } });
        if (updated) {
            const updatedUser = await Users.findOne({ where: { id_usuario: id } });
            return res.status(200).json(updatedUser);
        }
        return res.status(404).json({ error: 'Usuario no encontrado' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await UsersServices.deleteUser(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};