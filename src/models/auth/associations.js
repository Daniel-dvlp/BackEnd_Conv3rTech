const Role = require("./Role");
const Permission = require("./Permission");
const Privilege = require("./Privilege");
const PermissionPrivilege = require("./PermissionPrivilege");
const RolPermisoPrivilegio = require("../rol_permiso_privilegio/rol_permiso_privilegio");
const Users = require("../users/Users");
const UsuarioPermisoPrivilegio = require("../usuario_permiso_privilegio/usuario_permiso_privilegio");

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

// Asociaciones directas entre Usuarios, Permisos y Privilegios (muchos a muchos)
Users.belongsToMany(Permission, {
  through: UsuarioPermisoPrivilegio,
  foreignKey: "id_usuario",
  otherKey: "id_permiso",
  as: "permisos_directos",
});

Permission.belongsToMany(Users, {
  through: UsuarioPermisoPrivilegio,
  foreignKey: "id_permiso",
  otherKey: "id_usuario",
  as: "usuarios",
});

Users.belongsToMany(Privilege, {
  through: UsuarioPermisoPrivilegio,
  foreignKey: "id_usuario",
  otherKey: "id_privilegio",
  as: "privilegios_directos",
});

Privilege.belongsToMany(Users, {
  through: UsuarioPermisoPrivilegio,
  foreignKey: "id_privilegio",
  otherKey: "id_usuario",
  as: "usuarios",
});

// Asociaciones directas del pivot para facilitar inclusiones
// Esto habilita includes como { model: Permission, as: "permiso" } en consultas al pivot
RolPermisoPrivilegio.belongsTo(Permission, {
  foreignKey: "id_permiso",
  as: "permiso",
});

RolPermisoPrivilegio.belongsTo(Privilege, {
  foreignKey: "id_privilegio",
  as: "privilegio",
});

RolPermisoPrivilegio.belongsTo(Role, {
  foreignKey: "id_rol",
  as: "rol",
});

// Asociaciones directas del pivot usuario_permiso_privilegio
UsuarioPermisoPrivilegio.belongsTo(Permission, {
  foreignKey: "id_permiso",
  as: "permiso",
});

UsuarioPermisoPrivilegio.belongsTo(Privilege, {
  foreignKey: "id_privilegio",
  as: "privilegio",
});

UsuarioPermisoPrivilegio.belongsTo(Users, {
  foreignKey: "id_usuario",
  as: "usuario",
});

module.exports = {
  Role,
  Permission,
  Privilege,
  PermissionPrivilege,
  RolPermisoPrivilegio,
  UsuarioPermisoPrivilegio,
};