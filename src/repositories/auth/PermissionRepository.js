const Permission = require("../../models/auth/Permission");
const Privilege = require("../../models/auth/Privilege");
const PermissionPrivilege = require("../../models/auth/PermissionPrivilege");

class PermissionRepository {
  // Métodos para Permisos
  async findAllPermissions() {
    return Permission.findAll({
      where: { estado: true },
      include: [
        {
          model: Privilege,
          as: "privilegios",
          through: { attributes: [] },
        },
      ],
    });
  }

  async findPermissionById(id) {
    return Permission.findByPk(id, {
      include: [
        {
          model: Privilege,
          as: "privilegios",
          through: { attributes: [] },
        },
      ],
    });
  }

  async createPermission(permissionData) {
    return Permission.create(permissionData);
  }

  async updatePermission(id, permissionData) {
    const [updated] = await Permission.update(permissionData, {
      where: { id_permiso: id },
    });
    return updated > 0;
  }

  async deletePermission(id) {
    const [deleted] = await Permission.update(
      { estado: false },
      { where: { id_permiso: id } }
    );
    return deleted > 0;
  }

  // Métodos para Privilegios
  async findAllPrivileges() {
    return Privilege.findAll({
      where: { estado: true },
    });
  }

  async findPrivilegeById(id) {
    return Privilege.findByPk(id);
  }

  async createPrivilege(privilegeData) {
    return Privilege.create(privilegeData);
  }

  async updatePrivilege(id, privilegeData) {
    const [updated] = await Privilege.update(privilegeData, {
      where: { id_privilegio: id },
    });
    return updated > 0;
  }

  async deletePrivilege(id) {
    const [deleted] = await Privilege.update(
      { estado: false },
      { where: { id_privilegio: id } }
    );
    return deleted > 0;
  }

  // Métodos para asignar privilegios a permisos
  async assignPrivilegesToPermission(permissionId, privilegeIds) {
    // Eliminar privilegios existentes
    await PermissionPrivilege.destroy({
      where: { id_permiso: permissionId },
    });

    // Asignar nuevos privilegios
    const permissionPrivileges = privilegeIds.map((privilegeId) => ({
      id_permiso: permissionId,
      id_privilegio: privilegeId,
    }));

    if (permissionPrivileges.length > 0) {
      await PermissionPrivilege.bulkCreate(permissionPrivileges);
    }

    return true;
  }

  async getPermissionPrivileges(permissionId) {
    return PermissionPrivilege.findAll({
      where: { id_permiso: permissionId },
      include: [
        {
          model: Privilege,
          as: "privilegio",
          attributes: ["id_privilegio", "nombre_privilegio"],
        },
      ],
    });
  }
}

module.exports = new PermissionRepository();
