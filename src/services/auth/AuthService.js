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

      // Derivar permisos del rol desde RolPermisoPrivilegio (evita privilegios globales)
      const rolePermissionsRows = await roleRepository.getRolePermissions(
        user.rol.id_rol
      );
      const rolePermissionsObj = this.formatRolePivotPermissions(rolePermissionsRows);

      // Generar JWT usando permisos derivados del pivot de rol
      const token = this.generateToken(user, rolePermissionsObj);

      // Formatear los datos del usuario para el frontend
      const userData = {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        rol: user.rol.nombre_rol,
        id_rol: user.rol.id_rol,
        permisos: rolePermissionsObj
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

  generateToken(user, permisosObj) {
    const payload = {
      id_usuario: user.id_usuario,
      id_rol: user.rol.id_rol,
      permisos: permisosObj || this.formatPermissions(user?.rol?.permisos),
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
  }

  formatPermissions(permisos) {
    const formattedPermissions = {};
    if (!Array.isArray(permisos)) return formattedPermissions;
    permisos.forEach((permiso) => {
      const nombrePermiso = permiso?.nombre_permiso;
      const privilegios = Array.isArray(permiso?.privilegios)
        ? permiso.privilegios.map((p) => p?.nombre_privilegio).filter(Boolean)
        : [];
      if (nombrePermiso && privilegios.length > 0) {
        formattedPermissions[nombrePermiso] = privilegios;
      }
    });
    return formattedPermissions;
  }

  // Formatea filas provenientes del repositorio de RolPermisoPrivilegio
  // a la estructura { permiso: [privilegios] }
  formatRolePivotPermissions(rows) {
    const out = {};
    if (!Array.isArray(rows)) return out;
    for (const r of rows) {
      const permiso = r?.permiso?.nombre_permiso;
      const privilegio = r?.privilegio?.nombre_privilegio;
      if (!permiso || !privilegio) continue;
      if (!out[permiso]) out[permiso] = [];
      if (!out[permiso].includes(privilegio)) {
        out[permiso].push(privilegio);
      }
    }
    return out;
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
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const rows = await roleRepository.getRolePermissions(user.rol.id_rol);
      return this.formatRolePivotPermissions(rows);
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
