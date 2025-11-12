const { validationResult } = require("express-validator");
const authService = require("../../services/auth/AuthService");

class AuthController {
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: errors.array(),
        });
      }

      const { correo, contrasena } = req.body;
      const result = await authService.login(correo, contrasena);

      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Token requerido",
        });
      }

      const token = authHeader.substring(7);
      const decoded = await authService.verifyToken(token);

      // Obtener usuario
      const userRepository = require("../../repositories/auth/UserRepository");
      const user = await userRepository.findById(decoded.id_usuario);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      // Derivar permisos actuales del rol y generar nuevo token
      const roleRepository = require("../../repositories/auth/RoleRepository");
      const rows = await roleRepository.getRolePermissions(user.rol.id_rol);
      const permsObj = authService.formatRolePivotPermissions(rows);
      const newToken = authService.generateToken(user, permsObj);

      res.status(200).json({
        success: true,
        data: { token: newToken },
        message: "Token renovado exitosamente",
      });
    } catch (error) {
      console.error("Error en refreshToken:", error);
      res.status(401).json({
        success: false,
        message: "Token inválido",
      });
    }
  }

  async logout(req, res) {
    try {
      // En una implementación real, aquí se podría agregar el token a una blacklist
      res.status(200).json({
        success: true,
        message: "Logout exitoso",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error en el logout",
      });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.user.id_usuario;
      const userRepository = require("../../repositories/auth/UserRepository");
      const user = await userRepository.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      // Formatear respuesta para el frontend
      const profileData = {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.correo,
        celular: user.celular,
        documento: user.documento,
        tipoDocumento: user.tipo_documento,
        rol: user.rol ? user.rol.nombre_rol : null,
        estado_usuario: user.estado_usuario,
        fecha_creacion: user.fecha_creacion,
      };

      res.status(200).json({
        success: true,
        data: profileData,
        message: "Perfil obtenido exitosamente",
      });
    } catch (error) {
      console.error("Error en getProfile:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: errors.array(),
        });
      }

      const userId = req.user.id_usuario;

      // Mapear campos del frontend a la base de datos
      const updateData = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        correo: req.body.email || req.body.correo, // Aceptar ambos formatos
        celular: req.body.celular,
        documento: req.body.documento,
        tipo_documento: req.body.tipoDocumento || req.body.tipo_documento, // Aceptar ambos formatos
      };

      const updatedUser = await authService.updateProfile(userId, updateData);

      res.status(200).json({
        success: true,
        data: updatedUser,
        message: "Perfil actualizado exitosamente",
      });
    } catch (error) {
      console.error("Error en updateProfile:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: errors.array(),
        });
      }

      const userId = req.user.id_usuario;
      const { currentPassword, newPassword } = req.body;

      await authService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: "Contraseña actualizada exitosamente",
      });
    } catch (error) {
      console.error("Error en changePassword:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMyPermissions(req, res) {
    try {
      const userId = req.user.id_usuario;
      const permissions = await authService.getUserPermissions(userId);

      res.status(200).json({
        success: true,
        data: permissions,
        message: "Permisos obtenidos exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async requestPasswordRecovery(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: errors.array(),
        });
      }

      const { correo } = req.body;
      const result = await authService.requestPasswordRecovery(correo);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      const isNotFound = error?.code === "EMAIL_NOT_FOUND" || error?.message === "Correo no existente";
      res
        .status(isNotFound ? 404 : 400)
        .json({ success: false, message: isNotFound ? "Correo no existente" : error.message });
    }
  }

  async resetPasswordWithCode(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Datos de validación incorrectos",
          errors: errors.array(),
        });
      }

      const { correo, codigo, nuevaContrasena } = req.body;
      const result = await authService.resetPasswordWithCode(
        correo,
        codigo,
        nuevaContrasena
      );
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AuthController();
