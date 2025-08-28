const {
  RolPP,
  PermisoPrivilegio,
  Permisos,
  Privilegios,
} = require("../../models/associations");

/**
 * Middleware para verificar permisos específicos
 * @param {string} permiso - Nombre del permiso (módulo)
 * @param {string} privilegio - Nombre del privilegio (acción)
 * @returns {Function} Middleware de Express
 */
const checkPermission = (permiso, privilegio) => {
  return async (req, res, next) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.user || !req.user.id_usuario) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      // Obtener el rol del usuario
      const userRole = req.user.id_rol;
      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: "Usuario sin rol asignado",
        });
      }

      // Buscar el permiso y privilegio
      const permisoDB = await Permisos.findOne({
        where: { nombre_permiso: permiso },
      });

      const privilegioDB = await Privilegios.findOne({
        where: { nombre_privilegio: privilegio },
      });

      if (!permisoDB || !privilegioDB) {
        return res.status(400).json({
          success: false,
          message: "Permiso o privilegio no válido",
        });
      }

      // Verificar si el rol tiene el permiso-privilegio asignado
      const permisoPrivilegio = await PermisoPrivilegio.findOne({
        where: {
          id_permiso: permisoDB.id_permiso,
          id_privilegio: privilegioDB.id_privilegio,
        },
      });

      if (!permisoPrivilegio) {
        return res.status(403).json({
          success: false,
          message: `No tienes permiso para ${privilegio} en ${permiso}`,
        });
      }

      // Verificar si el rol tiene acceso a este permiso-privilegio
      const rolPP = await RolPP.findOne({
        where: {
          id_rol: userRole,
          id_pp: permisoPrivilegio.id_pp,
        },
      });

      if (!rolPP) {
        return res.status(403).json({
          success: false,
          message: `No tienes permiso para ${privilegio} en ${permiso}`,
        });
      }

      // Si llegamos aquí, el usuario tiene el permiso
      next();
    } catch (error) {
      console.error("Error al verificar permisos:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al verificar permisos",
      });
    }
  };
};

/**
 * Middleware para verificar múltiples permisos (OR lógico)
 * @param {Array} permissions - Array de objetos {permiso, privilegio}
 * @returns {Function} Middleware de Express
 */
const checkAnyPermission = (permissions) => {
  return async (req, res, next) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.user || !req.user.id_usuario) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      const userRole = req.user.id_rol;
      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: "Usuario sin rol asignado",
        });
      }

      // Verificar al menos uno de los permisos
      for (const { permiso, privilegio } of permissions) {
        const permisoDB = await Permisos.findOne({
          where: { nombre_permiso: permiso },
        });

        const privilegioDB = await Privilegios.findOne({
          where: { nombre_privilegio: privilegio },
        });

        if (permisoDB && privilegioDB) {
          const permisoPrivilegio = await PermisoPrivilegio.findOne({
            where: {
              id_permiso: permisoDB.id_permiso,
              id_privilegio: privilegioDB.id_privilegio,
            },
          });

          if (permisoPrivilegio) {
            const rolPP = await RolPP.findOne({
              where: {
                id_rol: userRole,
                id_pp: permisoPrivilegio.id_pp,
              },
            });

            if (rolPP) {
              // Si encuentra al menos un permiso válido, continúa
              return next();
            }
          }
        }
      }

      // Si no encuentra ningún permiso válido
      return res.status(403).json({
        success: false,
        message: "No tienes los permisos necesarios para esta acción",
      });
    } catch (error) {
      console.error("Error al verificar permisos múltiples:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al verificar permisos",
      });
    }
  };
};

/**
 * Middleware para verificar múltiples permisos (AND lógico)
 * @param {Array} permissions - Array de objetos {permiso, privilegio}
 * @returns {Function} Middleware de Express
 */
const checkAllPermissions = (permissions) => {
  return async (req, res, next) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.user || !req.user.id_usuario) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      const userRole = req.user.id_rol;
      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: "Usuario sin rol asignado",
        });
      }

      // Verificar todos los permisos
      for (const { permiso, privilegio } of permissions) {
        const permisoDB = await Permisos.findOne({
          where: { nombre_permiso: permiso },
        });

        const privilegioDB = await Privilegios.findOne({
          where: { nombre_privilegio: privilegio },
        });

        if (!permisoDB || !privilegioDB) {
          return res.status(400).json({
            success: false,
            message: `Permiso ${permiso} o privilegio ${privilegio} no válido`,
          });
        }

        const permisoPrivilegio = await PermisoPrivilegio.findOne({
          where: {
            id_permiso: permisoDB.id_permiso,
            id_privilegio: privilegioDB.id_privilegio,
          },
        });

        if (!permisoPrivilegio) {
          return res.status(403).json({
            success: false,
            message: `No tienes permiso para ${privilegio} en ${permiso}`,
          });
        }

        const rolPP = await RolPP.findOne({
          where: {
            id_rol: userRole,
            id_pp: permisoPrivilegio.id_pp,
          },
        });

        if (!rolPP) {
          return res.status(403).json({
            success: false,
            message: `No tienes permiso para ${privilegio} en ${permiso}`,
          });
        }
      }

      // Si llegamos aquí, el usuario tiene todos los permisos
      next();
    } catch (error) {
      console.error("Error al verificar permisos múltiples:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al verificar permisos",
      });
    }
  };
};

module.exports = {
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
};
