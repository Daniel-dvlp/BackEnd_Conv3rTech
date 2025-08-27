const { validationResult } = require('express-validator');
const authService = require('../../services/auth/auth_service');

class AuthController {
  /**
   * Login de usuario
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Autenticar usuario
      const result = await authService.authenticateUser(email, password);

      return res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: result
      });

    } catch (error) {
      console.error('Error en login:', error);
      
      return res.status(401).json({
        success: false,
        message: error.message || 'Error en la autenticación'
      });
    }
  }

  /**
   * Verificar token y obtener información del usuario
   * GET /api/auth/me
   */
  async getCurrentUser(req, res) {
    try {
      const user = await authService.getUserById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Información del usuario obtenida',
        data: {
          id: user.id_usuario,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.correo,
          documento: user.documento,
          tipo_documento: user.tipo_documento,
          celular: user.celular,
          rol: user.rol.nombre_rol,
          id_rol: user.id_rol,
          estado: user.estado.estado,
          fecha_creacion: user.fecha_creacion
        }
      });

    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Error obteniendo información del usuario'
      });
    }
  }

  /**
   * Obtener permisos del usuario actual
   * GET /api/auth/permissions
   */
  async getUserPermissions(req, res) {
    try {
      const permissions = await authService.getUserPermissions(req.user.id_rol);

      return res.status(200).json({
        success: true,
        message: 'Permisos obtenidos exitosamente',
        data: permissions
      });

    } catch (error) {
      console.error('Error obteniendo permisos:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Error obteniendo permisos del usuario'
      });
    }
  }

  /**
   * Verificar si el usuario tiene un permiso específico
   * POST /api/auth/check-permission
   */
  async checkPermission(req, res) {
    try {
      const { module, privilege } = req.body;

      if (!module || !privilege) {
        return res.status(400).json({
          success: false,
          message: 'Módulo y privilegio son requeridos'
        });
      }

      const hasPermission = await authService.hasPermission(
        req.user.id_rol,
        module,
        privilege
      );

      return res.status(200).json({
        success: true,
        message: 'Verificación de permiso completada',
        data: {
          hasPermission,
          module,
          privilege
        }
      });

    } catch (error) {
      console.error('Error verificando permiso:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Error verificando permiso'
      });
    }
  }

  /**
   * Logout (invalidar token)
   * POST /api/auth/logout
   */
  async logout(req, res) {
    try {
      // En una implementación más robusta, aquí se invalidaría el token
      // Por ahora, solo retornamos éxito ya que el cliente debe eliminar el token
      
      return res.status(200).json({
        success: true,
        message: 'Logout exitoso'
      });

    } catch (error) {
      console.error('Error en logout:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Error en el logout'
      });
    }
  }

  /**
   * Renovar token
   * POST /api/auth/refresh
   */
  async refreshToken(req, res) {
    try {
      // Obtener información actualizada del usuario
      const user = await authService.getUserById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Generar nuevo token
      const newToken = authService.generateToken(user);

      return res.status(200).json({
        success: true,
        message: 'Token renovado exitosamente',
        data: {
          token: newToken
        }
      });

    } catch (error) {
      console.error('Error renovando token:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Error renovando token'
      });
    }
  }
}

module.exports = new AuthController();
