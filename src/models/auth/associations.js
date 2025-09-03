const Role = require("./Role");
const Permission = require("./Permission");
const Privilege = require("./Privilege");
const PermissionPrivilege = require("./PermissionPrivilege");
const RolPermisoPrivilegio = require("../rol_permiso_privilegio/rol_permiso_privilegio");
const Users = require("../users/Users");

// Asociaciones entre Roles y Usuarios
Role.hasMany(Users, { foreignKey: "id_rol", as: "usuarios" });
Users.belongsTo(Role, { foreignKey: "id_rol", as: "rol" });

// Asociaciones entre Permisos y Privilegios (muchos a muchos)
Permission.belongsToMany(Privilege, {
  through: PermissionPrivilege,
  foreignKey: "id_permiso",
  otherKey: "id_privilegio",
  as: "privilegios",
});

Privilege.belongsToMany(Permission, {
  through: PermissionPrivilege,
  foreignKey: "id_privilegio",
  otherKey: "id_permiso",
  as: "permisos",
});

// Asociaciones entre Roles, Permisos y Privilegios (muchos a muchos)
Role.belongsToMany(Permission, {
  through: RolPermisoPrivilegio,
  foreignKey: "id_rol",
  otherKey: "id_permiso",
  as: "permisos",
});

Permission.belongsToMany(Role, {
  through: RolPermisoPrivilegio,
  foreignKey: "id_permiso",
  otherKey: "id_rol",
  as: "roles",
});

Role.belongsToMany(Privilege, {
  through: RolPermisoPrivilegio,
  foreignKey: "id_rol",
  otherKey: "id_privilegio",
  as: "privilegios",
});

Privilege.belongsToMany(Role, {
  through: RolPermisoPrivilegio,
  foreignKey: "id_privilegio",
  otherKey: "id_rol",
  as: "roles",
});

module.exports = {
  Role,
  Permission,
  Privilege,
  PermissionPrivilege,
  RolPermisoPrivilegio,
};
