const {
  Roles,
  Permisos,
  Privilegios,
  RolPermisoPrivilegio,
  EstadoUsuarios,
} = require("../../models/associations");
const { Sequelize } = require("sequelize");
const sequelize = require("../../config/database");

// ==================== ROLES ====================
const createRole = async (roleData) => {
  return Roles.create(roleData);
};

const getAllRoles = async () => {
  return Roles.findAll({
    where: { estado: true },
    order: [["nombre_rol", "ASC"]],
  });
};

const getRoleById = async (id) => {
  return Roles.findByPk(id);
};

const getRoleByName = async (nombre) => {
  return Roles.findOne({ where: { nombre_rol: nombre } });
};

const updateRole = async (id, roleData) => {
  return Roles.update(roleData, { where: { id_rol: id } });
};

const deleteRole = async (id) => {
  return Roles.update({ estado: false }, { where: { id_rol: id } });
};

// ==================== PERMISOS ====================
const createPermission = async (permissionData) => {
  return Permisos.create(permissionData);
};

const getAllPermissions = async () => {
  return Permisos.findAll({
    order: [["nombre_permiso", "ASC"]],
  });
};

const getPermissionById = async (id) => {
  return Permisos.findByPk(id);
};

const getPermissionByName = async (nombre) => {
  return Permisos.findOne({ where: { nombre_permiso: nombre } });
};

const updatePermission = async (id, permissionData) => {
  return Permisos.update(permissionData, { where: { id_permiso: id } });
};

const deletePermission = async (id) => {
  return Permisos.destroy({ where: { id_permiso: id } });
};

// ==================== PRIVILEGIOS ====================
const createPrivilege = async (privilegeData) => {
  return Privilegios.create(privilegeData);
};

const getAllPrivileges = async () => {
  return Privilegios.findAll({
    order: [["nombre_privilegio", "ASC"]],
  });
};

const getPrivilegeById = async (id) => {
  return Privilegios.findByPk(id);
};

const getPrivilegeByName = async (nombre) => {
  return Privilegios.findOne({ where: { nombre_privilegio: nombre } });
};

const updatePrivilege = async (id, privilegeData) => {
  return Privilegios.update(privilegeData, { where: { id_privilegio: id } });
};

const deletePrivilege = async (id) => {
  return Privilegios.destroy({ where: { id_privilegio: id } });
};

// ==================== ASIGNACIONES DE PERMISOS ====================
const assignPermissionToRole = async (roleId, permissionId, privilegeId) => {
  return RolPermisoPrivilegio.findOrCreate({
    where: {
      id_rol: roleId,
      id_permiso: permissionId,
      id_privilegio: privilegeId,
    },
    defaults: {
      id_rol: roleId,
      id_permiso: permissionId,
      id_privilegio: privilegeId,
    },
  });
};

const removePermissionFromRole = async (roleId, permissionId, privilegeId) => {
  return RolPermisoPrivilegio.destroy({
    where: {
      id_rol: roleId,
      id_permiso: permissionId,
      id_privilegio: privilegeId,
    },
  });
};

const getRolePermissions = async (roleId) => {
  const permissions = await sequelize.query(
    `
        SELECT 
            p.id_permiso,
            p.nombre_permiso,
            pr.id_privilegio,
            pr.nombre_privilegio
        FROM rol_permiso_privilegio rpp
        JOIN permisos p ON rpp.id_permiso = p.id_permiso
        JOIN privilegios pr ON rpp.id_privilegio = pr.id_privilegio
        WHERE rpp.id_rol = ?
        ORDER BY p.nombre_permiso, pr.nombre_privilegio
    `,
    {
      replacements: [roleId],
      type: Sequelize.QueryTypes.SELECT,
    }
  );

  // Organizar por módulo
  const organizedPermissions = {};
  permissions.forEach((permission) => {
    const moduleName = permission.nombre_permiso;
    if (!organizedPermissions[moduleName]) {
      organizedPermissions[moduleName] = [];
    }
    organizedPermissions[moduleName].push(permission.nombre_privilegio);
  });

  return organizedPermissions;
};

const getRolePermissionsDetailed = async (roleId) => {
  return RolPermisoPrivilegio.findAll({
    where: { id_rol: roleId },
    include: [
      {
        model: Permisos,
        attributes: ["id_permiso", "nombre_permiso"],
      },
      {
        model: Privilegios,
        attributes: ["id_privilegio", "nombre_privilegio"],
      },
    ],
  });
};

const bulkAssignPermissions = async (roleId, permissions) => {
  const t = await sequelize.transaction();
  try {
    // Eliminar permisos existentes del rol
    await RolPermisoPrivilegio.destroy({
      where: { id_rol: roleId },
      transaction: t,
    });

    // Crear nuevas asignaciones
    const assignments = [];
    for (const [moduleName, privileges] of Object.entries(permissions)) {
      const permission = await Permisos.findOne({
        where: { nombre_permiso: moduleName },
        transaction: t,
      });

      if (permission) {
        for (const privilegeName of privileges) {
          const privilege = await Privilegios.findOne({
            where: { nombre_privilegio: privilegeName },
            transaction: t,
          });

          if (privilege) {
            assignments.push({
              id_rol: roleId,
              id_permiso: permission.id_permiso,
              id_privilegio: privilege.id_privilegio,
            });
          }
        }
      }
    }

    if (assignments.length > 0) {
      await RolPermisoPrivilegio.bulkCreate(assignments, { transaction: t });
    }

    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

// ==================== ESTADOS DE USUARIO ====================
const getAllUserStates = async () => {
  return EstadoUsuarios.findAll({
    order: [["estado", "ASC"]],
  });
};

const getUserStateById = async (id) => {
  return EstadoUsuarios.findByPk(id);
};

const createUserState = async (stateData) => {
  return EstadoUsuarios.create(stateData);
};

const updateUserState = async (id, stateData) => {
  return EstadoUsuarios.update(stateData, { where: { id_estado_usuario: id } });
};

const deleteUserState = async (id) => {
  return EstadoUsuarios.destroy({ where: { id_estado_usuario: id } });
};

// ==================== CONSULTAS ESPECIALES ====================
const getRolesWithPermissions = async () => {
  const roles = await Roles.findAll({
    where: { estado: true },
  });

  const rolesWithPermissions = [];

  for (const role of roles) {
    const permissions = await getRolePermissions(role.id_rol);
    rolesWithPermissions.push({
      id_rol: role.id_rol,
      nombre_rol: role.nombre_rol,
      descripcion: role.descripcion,
      estado: role.estado,
      permisos: permissions,
    });
  }

  return rolesWithPermissions;
};

const getPermissionsSummary = async () => {
  const summary = await sequelize.query(
    `
        SELECT 
            r.nombre_rol,
            p.nombre_permiso,
            COUNT(pr.nombre_privilegio) as total_privilegios,
            GROUP_CONCAT(pr.nombre_privilegio ORDER BY pr.nombre_privilegio) as privilegios
        FROM roles r
        LEFT JOIN rol_permiso_privilegio rpp ON r.id_rol = rpp.id_rol
        LEFT JOIN permisos p ON rpp.id_permiso = p.id_permiso
        LEFT JOIN privilegios pr ON rpp.id_privilegio = pr.id_privilegio
        WHERE r.estado = true
        GROUP BY r.id_rol, p.id_permiso
        ORDER BY r.nombre_rol, p.nombre_permiso
    `,
    {
      type: Sequelize.QueryTypes.SELECT,
    }
  );

  return summary;
};

module.exports = {
  // Roles
  createRole,
  getAllRoles,
  getRoleById,
  getRoleByName,
  updateRole,
  deleteRole,

  // Permisos
  createPermission,
  getAllPermissions,
  getPermissionById,
  getPermissionByName,
  updatePermission,
  deletePermission,

  // Privilegios
  createPrivilege,
  getAllPrivileges,
  getPrivilegeById,
  getPrivilegeByName,
  updatePrivilege,
  deletePrivilege,

  // Asignaciones
  assignPermissionToRole,
  removePermissionFromRole,
  getRolePermissions,
  getRolePermissionsDetailed,
  bulkAssignPermissions,

  // Estados de usuario
  getAllUserStates,
  getUserStateById,
  createUserState,
  updateUserState,
  deleteUserState,

  // Consultas especiales
  getRolesWithPermissions,
  getPermissionsSummary,
};
