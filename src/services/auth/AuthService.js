const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../../repositories/auth/UserRepository");
const roleRepository = require("../../repositories/auth/RoleRepository");
const mailService = require("../common/MailService");

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

  // Mapeo específico de nombres de permisos (BD) a slugs del frontend
  getPermissionSlugMap() {
    return {
      Dashboard: "dashboard",
      Usuarios: "usuarios",
      Roles: "roles",
      Proveedores: "proveedores",
      "Categoría de productos": "categoria_productos",
      Productos: "productos",
      Compras: "compras",
      Servicios: "servicios",
      "Categoría de servicios": "categoria_servicios",
      "Órdenes de servicio": "ordenes_servicios",
      "Programación laboral": "programacion_laboral",
      Clientes: "clientes",
      "Venta de productos": "venta_productos",
      Citas: "citas",
      Cotizaciones: "cotizaciones",
      "Proyectos de servicio": "proyectos_servicios",
      "Pagos y abonos": "pagosyabonos",
    };
  }

  // Normaliza privilegios de BD a los usados en frontend
  normalizePrivilegeName(name) {
    const map = {
      crear: "Crear",
      editar: "Editar",
      ver: "Ver",
      eliminar: "Eliminar",
      crear_entrega: "Crear entrega",
    };
    return map[name] || name;
  }

  // Convierte un nombre de permiso de BD a slug del frontend
  toPermissionSlug(nombrePermiso) {
    const dict = this.getPermissionSlugMap();
    if (dict[nombrePermiso]) return dict[nombrePermiso];
    // Fallback genérico: quitar acentos, minúsculas, espacios->guiones bajos
    const normalized = nombrePermiso
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    return normalized;
  }

  formatPermissions(permisos) {
    const formattedPermissions = {};
    if (!Array.isArray(permisos)) return formattedPermissions;
    permisos.forEach((permiso) => {
      const nombrePermiso = permiso?.nombre_permiso;
      const privilegiosRaw = Array.isArray(permiso?.privilegios)
        ? permiso.privilegios.map((p) => p?.nombre_privilegio).filter(Boolean)
        : [];
      if (nombrePermiso && privilegiosRaw.length > 0) {
        const slug = this.toPermissionSlug(nombrePermiso);
        const privilegios = privilegiosRaw.map((n) => this.normalizePrivilegeName(n));
        formattedPermissions[slug] = privilegios;
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
      const permisoNombre = r?.permiso?.nombre_permiso;
      const privilegioNombre = r?.privilegio?.nombre_privilegio;
      if (!permisoNombre || !privilegioNombre) continue;
      const slug = this.toPermissionSlug(permisoNombre);
      const priv = this.normalizePrivilegeName(privilegioNombre);
      if (!out[slug]) out[slug] = [];
      if (!out[slug].includes(priv)) {
        out[slug].push(priv);
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

  // ====== Recuperación de contraseña con código enviado al correo ======

  validatePasswordComplexity(password) {
    const lengthOk = password.length >= 6 && password.length <= 15;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    return lengthOk && hasUpper && hasLower && hasDigit && hasSpecial;
  }

  generateRecoveryCode() {
    // Código numérico de 6 dígitos
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  async requestPasswordRecovery(email) {
    // Buscar usuario por correo
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // No revelar si existe o no: responder éxito genérico
      return { success: true, message: "Si el correo existe, se envió el código" };
    }

    // Generar y hashear código
    const code = this.generateRecoveryCode();
    const hash = await bcrypt.hash(code, 12);

    // Expiración en 15 minutos
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const sentAt = new Date();

    await userRepository.setResetCodeByEmail(email, hash, expiresAt, sentAt);

    // Enviar correo con plantilla y nombre del usuario
    const displayName = [user.nombre, user.apellido].filter(Boolean).join(" ") || user.correo;
    await mailService.sendPasswordRecoveryCode(email, code, displayName);

    return { success: true, message: "Código enviado al correo" };
  }

  async resetPasswordWithCode(email, code, newPassword) {
    // Validar complejidad
    if (!this.validatePasswordComplexity(newPassword)) {
      throw new Error(
        "La contraseña debe tener 6-15 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial"
      );
    }

    const user = await userRepository.findByEmail(email);
    if (!user || !user.reset_code_hash || !user.reset_code_expires_at) {
      throw new Error("Solicitud de recuperación inválida o expirada");
    }

    // Verificar expiración
    if (new Date(user.reset_code_expires_at).getTime() < Date.now()) {
      throw new Error("El código ha expirado");
    }

    // Validar código
    const isValid = await bcrypt.compare(code, user.reset_code_hash);
    if (!isValid) {
      throw new Error("Código incorrecto");
    }

    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const ok = await userRepository.updatePasswordByEmail(email, hashedPassword);
    if (!ok) {
      throw new Error("No se pudo actualizar la contraseña");
    }

    // Limpiar campos de código
    await userRepository.clearResetCodeByEmail(email);

    return { success: true, message: "Contraseña actualizada" };
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
