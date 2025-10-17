const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../../repositories/auth/UserRepository");
const roleRepository = require("../../repositories/auth/RoleRepository");

class AuthService {
  async login(email, password) {
    try {
      // Buscar usuario por email
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new Error("Credenciales inválidas");
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.contrasena);
      if (!isValidPassword) {
        throw new Error("Credenciales inválidas");
      }

      // Verificar que el usuario esté activo
      if (user.estado_usuario !== "Activo") {
        throw new Error("Usuario inactivo");
      }

      // Obtener permisos del usuario
      const userWithPermissions = await userRepository.findByIdWithPermissions(
        user.id_usuario
      );

      // Generar JWT
      const token = this.generateToken(userWithPermissions);

      // Formatear los datos del usuario para el frontend
      const userData = {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        rol: user.rol.nombre_rol,
        id_rol: user.rol.id_rol,
        permisos: this.formatPermissions(userWithPermissions.rol.permisos)
      };

      return {
        success: true,
        data: {
          token,
          user: userData
        },
        message: "Login exitoso",
      };
    } catch (error) {
      throw error;
    }
  }

  generateToken(user) {
    const payload = {
      id_usuario: user.id_usuario,
      id_rol: user.rol.id_rol,
      permisos: this.formatPermissions(user.rol.permisos),
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
  }

  formatPermissions(permisos) {
    const formattedPermissions = {};

    permisos.forEach((permiso) => {
      formattedPermissions[permiso.nombre_permiso] = permiso.privilegios.map(
        (privilegio) => privilegio.nombre_privilegio
      );
    });

    return formattedPermissions;
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userRepository.findById(decoded.id_usuario);

      if (!user || user.estado_usuario !== "Activo") {
        throw new Error("Usuario no válido");
      }

      return decoded;
    } catch (error) {
      throw new Error("Token inválido");
    }
  }

  async getUserPermissions(userId) {
    try {
      const user = await userRepository.findByIdWithPermissions(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      return this.formatPermissions(user.rol.permisos);
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(userId, data) {
    try {
      // Validar que solo se actualicen campos permitidos
      const allowedFields = [
        "nombre",
        "apellido",
        "celular",
        "correo",
        "documento",
        "tipo_documento",
      ];
      const updateData = {};

      for (const field of allowedFields) {
        if (data[field] !== undefined) {
          updateData[field] = data[field];
        }
      }

      const updated = await userRepository.updateProfile(userId, updateData);
      if (!updated) {
        throw new Error("No se pudo actualizar el perfil");
      }

      return await userRepository.findById(userId);
    } catch (error) {
      throw error;
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await userRepository.findByIdWithPassword(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Verificar contraseña actual
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.contrasena
      );
      if (!isValidPassword) {
        throw new Error("Contraseña actual incorrecta");
      }

      // Encriptar nueva contraseña
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Actualizar contraseña
      const updated = await userRepository.updatePassword(
        userId,
        hashedPassword
      );
      if (!updated) {
        throw new Error("No se pudo actualizar la contraseña");
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async assignRolePermissions(roleId, permissions) {
    try {
      const role = await roleRepository.findById(roleId);
      if (!role) {
        throw new Error("Rol no encontrado");
      }

      await roleRepository.assignPermissions(roleId, permissions);
      return true;
    } catch (error) {
      throw error;
    }
  }

  hasPermission(userPermissions, permission, privilege) {
    if (!userPermissions || !userPermissions[permission]) {
      return false;
    }

    return userPermissions[permission].includes(privilege);
  }

  hasAnyPermission(userPermissions, permissions) {
    return permissions.some(({ permission, privilege }) =>
      this.hasPermission(userPermissions, permission, privilege)
    );
  }

  hasAllPermissions(userPermissions, permissions) {
    return permissions.every(({ permission, privilege }) =>
      this.hasPermission(userPermissions, permission, privilege)
    );
  }
}

module.exports = new AuthService();
