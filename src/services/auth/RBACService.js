const {
  Users,
  Roles,
  Permisos,
  Privilegios,
  PermisoPrivilegio,
  RolPP,
  EstadoUsuarios,
} = require("../../models/associations");

class RBACService {
  /**
   * Obtener todos los permisos de un usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Array>} Array de permisos del usuario
   */
  async getUserPermissions(userId) {
    try {
      const user = await Users.findByPk(userId, {
        include: [
          {
            model: Roles,
            as: "rol",
            include: [
              {
                model: PermisoPrivilegio,
                as: "permisos_privilegios",
                include: [
                  {
                    model: Permisos,
                    as: "permiso",
                  },
                  {
                    model: Privilegios,
                    as: "privilegio",
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Extraer y formatear los permisos
      const permissions = [];
      if (user.rol && user.rol.permisos_privilegios) {
        user.rol.permisos_privilegios.forEach((pp) => {
          permissions.push({
            permiso: pp.permiso.nombre_permiso,
            privilegio: pp.privilegio.nombre_privilegio,
            permiso_id: pp.permiso.id_permiso,
            privilegio_id: pp.privilegio.id_privilegio,
          });
        });
      }

      return permissions;
    } catch (error) {
      throw new Error(
        `Error al obtener permisos del usuario: ${error.message}`
      );
    }
  }

  /**
   * Verificar si un usuario tiene un permiso específico
   * @param {number} userId - ID del usuario
   * @param {string} permiso - Nombre del permiso
   * @param {string} privilegio - Nombre del privilegio
   * @returns {Promise<boolean>} True si tiene el permiso, false en caso contrario
   */
  async hasPermission(userId, permiso, privilegio) {
    try {
      const user = await Users.findByPk(userId, {
        include: [
          {
            model: Roles,
            as: "rol",
          },
        ],
      });

      if (!user || !user.rol) {
        return false;
      }

      const permisoDB = await Permisos.findOne({
        where: { nombre_permiso: permiso },
      });

      const privilegioDB = await Privilegios.findOne({
        where: { nombre_privilegio: privilegio },
      });

      if (!permisoDB || !privilegioDB) {
        return false;
      }

      const permisoPrivilegio = await PermisoPrivilegio.findOne({
        where: {
          id_permiso: permisoDB.id_permiso,
          id_privilegio: privilegioDB.id_privilegio,
        },
      });

      if (!permisoPrivilegio) {
        return false;
      }

      const rolPP = await RolPP.findOne({
        where: {
          id_rol: user.rol.id_rol,
          id_pp: permisoPrivilegio.id_pp,
        },
      });

      return !!rolPP;
    } catch (error) {
      console.error("Error al verificar permiso:", error);
      return false;
    }
  }

  /**
   * Obtener todos los roles con sus permisos
   * @returns {Promise<Array>} Array de roles con sus permisos
   */
  async getAllRolesWithPermissions() {
    try {
      const roles = await Roles.findAll({
        include: [
          {
            model: PermisoPrivilegio,
            as: "permisos_privilegios",
            include: [
              {
                model: Permisos,
                as: "permiso",
              },
              {
                model: Privilegios,
                as: "privilegio",
              },
            ],
          },
        ],
      });

      return roles.map((role) => ({
        id_rol: role.id_rol,
        nombre_rol: role.nombre_rol,
        descripcion: role.descripcion,
        estado: role.estado,
        permisos: role.permisos_privilegios.map((pp) => ({
          permiso: pp.permiso.nombre_permiso,
          privilegio: pp.privilegio.nombre_privilegio,
        })),
      }));
    } catch (error) {
      throw new Error(`Error al obtener roles con permisos: ${error.message}`);
    }
  }

  /**
   * Asignar permisos a un rol
   * @param {number} roleId - ID del rol
   * @param {Array} permissions - Array de objetos {permiso, privilegio}
   * @returns {Promise<Object>} Resultado de la operación
   */
  async assignPermissionsToRole(roleId, permissions) {
    const transaction = await sequelize.transaction();

    try {
      const role = await Roles.findByPk(roleId);
      if (!role) {
        throw new Error("Rol no encontrado");
      }

      // Eliminar permisos existentes del rol
      await RolPP.destroy({
        where: { id_rol: roleId },
        transaction,
      });

      // Asignar nuevos permisos
      for (const { permiso, privilegio } of permissions) {
        const permisoDB = await Permisos.findOne({
          where: { nombre_permiso: permiso },
        });

        const privilegioDB = await Privilegios.findOne({
          where: { nombre_privilegio: privilegio },
        });

        if (!permisoDB || !privilegioDB) {
          throw new Error(
            `Permiso ${permiso} o privilegio ${privilegio} no válido`
          );
        }

        // Crear o encontrar la relación permiso-privilegio
        const [permisoPrivilegio] = await PermisoPrivilegio.findOrCreate({
          where: {
            id_permiso: permisoDB.id_permiso,
            id_privilegio: privilegioDB.id_privilegio,
          },
          transaction,
        });

        // Asignar al rol
        await RolPP.create(
          {
            id_rol: roleId,
            id_pp: permisoPrivilegio.id_pp,
          },
          { transaction }
        );
      }

      await transaction.commit();

      return {
        success: true,
        message: "Permisos asignados correctamente al rol",
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error al asignar permisos: ${error.message}`);
    }
  }

  /**
   * Obtener todos los permisos disponibles
   * @returns {Promise<Object>} Objeto con permisos y privilegios
   */
  async getAvailablePermissions() {
    try {
      const permisos = await Permisos.findAll();
      const privilegios = await Privilegios.findAll();

      return {
        permisos: permisos.map((p) => ({
          id: p.id_permiso,
          nombre: p.nombre_permiso,
        })),
        privilegios: privilegios.map((p) => ({
          id: p.id_privilegio,
          nombre: p.nombre_privilegio,
        })),
      };
    } catch (error) {
      throw new Error(
        `Error al obtener permisos disponibles: ${error.message}`
      );
    }
  }

  /**
   * Crear un nuevo permiso
   * @param {string} nombre - Nombre del permiso
   * @returns {Promise<Object>} Permiso creado
   */
  async createPermission(nombre) {
    try {
      const permiso = await Permisos.create({ nombre_permiso: nombre });
      return permiso;
    } catch (error) {
      throw new Error(`Error al crear permiso: ${error.message}`);
    }
  }

  /**
   * Crear un nuevo privilegio
   * @param {string} nombre - Nombre del privilegio
   * @returns {Promise<Object>} Privilegio creado
   */
  async createPrivilege(nombre) {
    try {
      const privilegio = await Privilegios.create({
        nombre_privilegio: nombre,
      });
      return privilegio;
    } catch (error) {
      throw new Error(`Error al crear privilegio: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas del sistema RBAC
   * @returns {Promise<Object>} Estadísticas del sistema
   */
  async getRBACStats() {
    try {
      const totalRoles = await Roles.count();
      const totalPermisos = await Permisos.count();
      const totalPrivilegios = await Privilegios.count();
      const totalUsers = await Users.count();
      const totalPermisoPrivilegios = await PermisoPrivilegio.count();
      const totalRolPP = await RolPP.count();

      return {
        totalRoles,
        totalPermisos,
        totalPrivilegios,
        totalUsers,
        totalPermisoPrivilegios,
        totalRolPP,
        totalCombinations: totalPermisos * totalPrivilegios,
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas RBAC: ${error.message}`);
    }
  }

  /**
   * Obtener usuarios por rol
   * @param {number} roleId - ID del rol
   * @returns {Promise<Array>} Array de usuarios del rol
   */
  async getUsersByRole(roleId) {
    try {
      const users = await Users.findAll({
        where: { id_rol: roleId },
        include: [
          {
            model: Roles,
            as: "rol",
          },
          {
            model: EstadoUsuarios,
            as: "estado",
          },
        ],
      });

      return users.map((user) => ({
        id_usuario: user.id_usuario,
        documento: user.documento,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        rol: user.rol.nombre_rol,
        estado: user.estado.estado,
      }));
    } catch (error) {
      throw new Error(`Error al obtener usuarios por rol: ${error.message}`);
    }
  }
}

module.exports = new RBACService();
