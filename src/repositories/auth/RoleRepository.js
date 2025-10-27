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
    // Validación básica del payload
    if (!Array.isArray(permissions)) {
      throw new Error("El payload de permisos debe ser un array");
    }

    console.log(
      "[RoleRepository.assignPermissions] roleId=",
      roleId,
      "permissionsCount=",
      permissions.length
    );

    // Eliminar permisos existentes
    await RolPermisoPrivilegio.destroy({ where: { id_rol: roleId } });

    // Asignar nuevos permisos con deduplicación
    const rolePermissions = [];
    const comboSet = new Set(); // evita duplicados (rol, permiso, privilegio)

    for (const permission of permissions) {
      const permId = permission?.id_permiso;
      const privs = Array.isArray(permission?.privilegios)
        ? permission.privilegios
        : [];

      if (typeof permId !== "number") {
        console.log(
          "[RoleRepository.assignPermissions] permiso inválido, id_permiso=",
          permId
        );
        continue;
      }

      const privSet = new Set();
      for (const privilege of privs) {
        const privId = privilege?.id_privilegio;
        if (typeof privId !== "number") {
          console.log(
            "[RoleRepository.assignPermissions] privilegio inválido, id_privilegio=",
            privId
          );
          continue;
        }
        // dedupe por permiso
        if (privSet.has(privId)) continue;
        privSet.add(privId);

        const key = `${roleId}-${permId}-${privId}`;
        if (comboSet.has(key)) continue;
        comboSet.add(key);

        rolePermissions.push({
          id_rol: roleId,
          id_permiso: permId,
          id_privilegio: privId,
        });
      }
    }

    console.log(
      "[RoleRepository.assignPermissions] bulkCreate count=",
      rolePermissions.length
    );

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
