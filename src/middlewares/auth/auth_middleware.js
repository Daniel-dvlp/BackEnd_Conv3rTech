const authService = require('../../services/auth/auth_service');

/**
 * Middleware para verificar si el usuario está autenticado
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    // Verificar token
    const decoded = authService.verifyToken(token);
    
    // Obtener información actualizada del usuario
    const user = await authService.getUserById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si el usuario está activo
    if (user.estado.estado !== 'Activo') {
      return res.status(401).json({
        success: false,
        message: `Usuario ${user.estado.estado.toLowerCase()}`
      });
    }

    // Agregar información del usuario al request
    req.user = {
      id: user.id_usuario,
      email: user.correo,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: user.rol.nombre_rol,
      id_rol: user.id_rol,
      estado: user.estado.estado
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

/**
 * Middleware para verificar permisos específicos
 * @param {String} module - Nombre del módulo
 * @param {String} privilege - Privilegio requerido (crear, leer, actualizar, eliminar)
 */
const requirePermission = (module, privilege) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const hasPermission = await authService.hasPermission(
        req.user.id_rol,
        module,
        privilege
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `No tienes permisos para ${privilege} en el módulo ${module}`
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error verificando permisos'
      });
    }
  };
};

/**
 * Middleware para verificar si el usuario es administrador
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
  }

  if (req.user.rol !== 'Administrador') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador'
    });
  }

  next();
};

/**
 * Middleware para verificar si el usuario es coordinador o administrador
 */
const requireCoordinatorOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
  }

  if (!['Administrador', 'Coordinador'].includes(req.user.rol)) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de coordinador o administrador'
    });
  }

  next();
};

/**
 * Middleware para filtrar datos por usuario técnico
 * Solo aplica para técnicos, otros roles ven todos los datos
 */
const filterByUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
  }

  // Si es técnico, agregar filtro por ID de usuario
  if (req.user.rol === 'Técnico') {
    req.userFilter = { id_usuario: req.user.id };
  }

  next();
};

module.exports = {
  authenticateToken,
  requirePermission,
  requireAdmin,
  requireCoordinatorOrAdmin,
  filterByUser
};
