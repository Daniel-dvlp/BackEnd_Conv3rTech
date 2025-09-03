const Role = require("../../models/auth/Role");
const Permission = require("../../models/auth/Permission");
const Privilege = require("../../models/auth/Privilege");
const RolPermisoPrivilegio = require("../../models/rol_permiso_privilegio/rol_permiso_privilegio");

class RoleRepository {
  async findAll() {
    return Role.findAll({
      where: { estado: true },
      include: [
        {
          model: Permission,
          as: "permisos",
          through: { attributes: [] },
          include: [
            {
              model: Privilege,
              as: "privilegios",
              through: { attributes: [] },
            },
          ],
        },
      ],
    });
  }

  async findById(id) {
    return Role.findByPk(id, {
      include: [
        {
          model: Permission,
          as: "permisos",
          through: { attributes: [] },
          include: [
            {
              model: Privilege,
              as: "privilegios",
              through: { attributes: [] },
            },
          ],
        },
      ],
    });
  }

  async create(roleData) {
    return Role.create(roleData);
  }

  async update(id, roleData) {
    const [updated] = await Role.update(roleData, {
      where: { id_rol: id },
    });
    return updated > 0;
  }

  async delete(id) {
    const [deleted] = await Role.update(
      { estado: false },
      { where: { id_rol: id } }
    );
    return deleted > 0;
  }

  async assignPermissions(roleId, permissions) {
    // Eliminar permisos existentes
    await RolPermisoPrivilegio.destroy({
      where: { id_rol: roleId },
    });

    // Asignar nuevos permisos
    const rolePermissions = [];
    for (const permission of permissions) {
      for (const privilege of permission.privilegios) {
        rolePermissions.push({
          id_rol: roleId,
          id_permiso: permission.id_permiso,
          id_privilegio: privilege.id_privilegio,
        });
      }
    }

    if (rolePermissions.length > 0) {
      await RolPermisoPrivilegio.bulkCreate(rolePermissions);
    }

    return true;
  }

  async getRolePermissions(roleId) {
    return RolPermisoPrivilegio.findAll({
      where: { id_rol: roleId },
      include: [
        {
          model: Permission,
          as: "permiso",
          attributes: ["id_permiso", "nombre_permiso"],
        },
        {
          model: Privilege,
          as: "privilegio",
          attributes: ["id_privilegio", "nombre_privilegio"],
        },
      ],
    });
  }
}

module.exports = new RoleRepository();
