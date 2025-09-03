const authService = require("../../services/auth/AuthService");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token de autenticación requerido",
      });
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    const decoded = await authService.verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado",
    });
  }
};

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      if (!allowedRoles.includes(req.user.id_rol)) {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para acceder a este recurso",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error en la validación de rol",
      });
    }
  };
};

const permissionMiddleware = (permission, privilege) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      const hasPermission = authService.hasPermission(
        req.user.permisos,
        permission,
        privilege
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `No tienes el privilegio '${privilege}' para el permiso '${permission}'`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error en la validación de permisos",
      });
    }
  };
};

const anyPermissionMiddleware = (permissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      const hasAnyPermission = authService.hasAnyPermission(
        req.user.permisos,
        permissions
      );

      if (!hasAnyPermission) {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos suficientes para acceder a este recurso",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error en la validación de permisos",
      });
    }
  };
};

const allPermissionsMiddleware = (permissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      const hasAllPermissions = authService.hasAllPermissions(
        req.user.permisos,
        permissions
      );

      if (!hasAllPermissions) {
        return res.status(403).json({
          success: false,
          message:
            "No tienes todos los permisos requeridos para acceder a este recurso",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error en la validación de permisos",
      });
    }
  };
};

const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
    }

    // Verificar si es administrador (id_rol = 1)
    if (req.user.id_rol !== 1) {
      return res.status(403).json({
        success: false,
        message: "Acceso restringido solo para administradores",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error en la validación de administrador",
    });
  }
};

module.exports = {
  authMiddleware,
  roleMiddleware,
  permissionMiddleware,
  anyPermissionMiddleware,
  allPermissionsMiddleware,
  adminMiddleware,
};
