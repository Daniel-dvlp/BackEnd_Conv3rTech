const { validationResult } = require("express-validator");
const UsersServices = require('../../services/users/UsersServices');
const Users = require('../../models/users/Users');

const createUser = async (req, res) => {
    // Solo Admin (1) y Coordinador (2) pueden crear usuarios
    if (req.user && ![1, 2].includes(req.user.id_rol)) {
        return res.status(403).json({ error: "No tienes permisos para crear usuarios" });
    }

    console.log("Body recibido:", req.body);
    console.log("Headers:", req.headers);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errores de validación:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await UsersServices.createUser(req.body);
        res.status(200).json(user);
    } catch (error) {
        console.log("Error en servicio:", error);
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

const getUsersByRole = async (req, res) => {
    try {
        const { roleName } = req.params;
        console.log(`Searching users by role: ${roleName}`);
        const users = await UsersServices.getUsersByRoleName(roleName);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsersByRole:", error);
        res.status(400).json({ 
            error: error.message,
            stack: error.stack,
            details: "Error fetching users by role" 
        });
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
        const updatedUser = await UsersServices.updateUser(id, req.body);
        if (updatedUser) {
            return res.status(200).json(updatedUser);
        }
        return res.status(404).json({ error: 'Usuario no encontrado' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        // Solo Admin (1) puede eliminar
        if (req.user && req.user.id_rol !== 1) {
            return res.status(403).json({ error: "Solo administradores pueden eliminar usuarios" });
        }

        const deleted = await UsersServices.deleteUser(req.params.id);
        if (deleted) {
            return res.status(200).json({ message: 'Usuario borrado exitosamente' });
        }
        return res.status(404).json({ error: 'Usuario no encontrado' });
    } catch (error) {
        const status = error.statusCode || 400;
        return res.status(status).json({ error: error.message });
    }
};

const changeUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado_usuario } = req.body;
        const requesterId = req.user ? req.user.id : null;
        
        if (!estado_usuario) {
            return res.status(400).json({ error: "El campo 'estado_usuario' es requerido" });
        }

        const userToUpdate = await UsersServices.getUserById(id);
        if (!userToUpdate) {
             return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        if (estado_usuario === 'Inactivo') {
            // Validar que no sea Admin
            if (userToUpdate.id_rol === 1) {
                return res.status(403).json({ error: "Error, no puedes desactivar al administrador" });
            }
            // Validar auto-desactivación
            if (requesterId && String(requesterId) === String(id)) {
                return res.status(403).json({ error: "Error, no puedes desactivar tu propio usuario" });
            }
        }

        const updatedUser = await UsersServices.changeUserStatus(id, estado_usuario);
        
        if (updatedUser) {
            return res.status(200).json({
                message: 'Estado de usuario actualizado exitosamente',
                user: updatedUser
            });
        }
        return res.status(404).json({ error: 'Usuario no encontrado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Nuevas funciones para el perfil del usuario logueado
const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id_usuario || req.user.id;
        const user = await UsersServices.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const searchUsers = async (req, res) => {

    try {
        const users = await UsersServices.searchUsers(req.params.term);
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateMyProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const userId = req.user.id_usuario || req.user.id;
        const updatedUser = await UsersServices.updateMyProfile(userId, req.body);
        if (updatedUser) {
            return res.status(200).json({
                success: true,
                message: 'Perfil actualizado exitosamente',
                user: updatedUser
            });
        }
        return res.status(404).json({ error: 'Usuario no encontrado' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const changeMyPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const userId = req.user.id_usuario || req.user.id;
        const { currentPassword, newPassword } = req.body;
        
        const result = await UsersServices.changeMyPassword(userId, currentPassword, newPassword);
        
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Contraseña actualizada exitosamente'
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });

    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers,
    getMyProfile,
    updateMyProfile,
    changeMyPassword,
    getUsersByRole,
    changeUserStatus
};