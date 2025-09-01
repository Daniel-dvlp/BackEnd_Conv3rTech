const UserRepository = require("../../repositories/users/UsersRepositories");
const bcrypt = require("bcryptjs");

const createUser = async (userData) => {
  return UserRepository.createUser(userData);
};

const getAllUsers = async () => {
  return UserRepository.getAllUsers();
};

const getUserById = async (id) => {
  return UserRepository.getUserById(id);
};

const updateUser = async (id, userData) => {
  const updated = await UserRepository.updateUser(id, userData);
  if (updated[0] > 0) {
    return UserRepository.getUserById(id);
  }
  return null;
};

const deleteUser = async (id) => {
  const deleted = await UserRepository.deleteUser(id);
  return deleted > 0;
};

// Nuevas funciones para el perfil del usuario logueado
const updateMyProfile = async (userId, userData) => {
  // Solo permitir actualizar campos específicos del perfil
  const allowedFields = [
    "nombre",
    "apellido",
    "correo",
    "celular",
    "documento",
    "tipo_documento",
  ];
  const filteredData = {};

  allowedFields.forEach((field) => {
    if (userData[field] !== undefined) {
      filteredData[field] = userData[field];
    }
  });

  const updated = await UserRepository.updateUser(userId, filteredData);
  if (updated[0] > 0) {
    return UserRepository.getUserById(userId);
  }
  return null;
};

const changeMyPassword = async (userId, currentPassword, newPassword) => {
  try {
    // Obtener el usuario actual
    const user = await UserRepository.getUserById(userId);
    if (!user) {
      return { success: false, message: "Usuario no encontrado" };
    }

    // Verificar la contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.contrasena
    );
    if (!isCurrentPasswordValid) {
      return { success: false, message: "La contraseña actual es incorrecta" };
    }

    // Validar que la nueva contraseña sea diferente
    if (currentPassword === newPassword) {
      return {
        success: false,
        message: "La nueva contraseña debe ser diferente a la actual",
      };
    }

    // Validar longitud mínima de la nueva contraseña
    if (newPassword.length < 6) {
      return {
        success: false,
        message: "La nueva contraseña debe tener al menos 6 caracteres",
      };
    }

    // Encriptar la nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar la contraseña
    const updated = await UserRepository.updateUser(userId, {
      contrasena: hashedPassword,
    });

    if (updated[0] > 0) {
      return { success: true, message: "Contraseña actualizada exitosamente" };
    } else {
      return { success: false, message: "Error al actualizar la contraseña" };
    }
  } catch (error) {
    throw new Error("Error al cambiar la contraseña: " + error.message);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateMyProfile,
  changeMyPassword,
};
