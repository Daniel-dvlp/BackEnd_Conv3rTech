const Users = require("./users/Users");
const Roles = require("./roles/roles");
const Permisos = require("./permisos/permisos");
const Privilegios = require("./privilegios/privilegios");
const PermisoPrivilegio = require("./permiso_privilegio/permiso_privilegio");
const RolPP = require("./rol_pp/rol_pp");

// Modelos básicos para evitar conflictos de sincronización
const Clients = require("./clients/Clients");
const AddressClients = require("./clients/AddressClients");

// Asociación Usuario - Rol
Users.belongsTo(Roles, {
  foreignKey: "id_rol",
  as: "rol",
});
Roles.hasMany(Users, {
  foreignKey: "id_rol",
  as: "usuarios",
});

// Asociación Permiso - Privilegio (Tabla intermedia permiso_privilegio)
Permisos.belongsToMany(Privilegios, {
  through: PermisoPrivilegio,
  foreignKey: "id_permiso",
  otherKey: "id_privilegio",
  as: "privilegios",
});

Privilegios.belongsToMany(Permisos, {
  through: PermisoPrivilegio,
  foreignKey: "id_privilegio",
  otherKey: "id_permiso",
  as: "permisos",
});

// Asociación Rol - PermisoPrivilegio (Tabla intermedia rol_pp)
Roles.belongsToMany(PermisoPrivilegio, {
  through: RolPP,
  foreignKey: "id_rol",
  otherKey: "id_pp",
  as: "permisos_privilegios",
});

PermisoPrivilegio.belongsToMany(Roles, {
  through: RolPP,
  foreignKey: "id_pp",
  otherKey: "id_rol",
  as: "roles",
});

// Asociaciones directas para las tablas intermedias
PermisoPrivilegio.belongsTo(Permisos, {
  foreignKey: "id_permiso",
  as: "permiso",
});

PermisoPrivilegio.belongsTo(Privilegios, {
  foreignKey: "id_privilegio",
  as: "privilegio",
});

RolPP.belongsTo(Roles, {
  foreignKey: "id_rol",
  as: "rol",
});

RolPP.belongsTo(PermisoPrivilegio, {
  foreignKey: "id_pp",
  as: "permiso_privilegio",
});

// Asociaciones inversas para completar las relaciones
Permisos.hasMany(PermisoPrivilegio, {
  foreignKey: "id_permiso",
  as: "asignaciones_privilegios",
});

Privilegios.hasMany(PermisoPrivilegio, {
  foreignKey: "id_privilegio",
  as: "asignaciones_permisos",
});

Roles.hasMany(RolPP, {
  foreignKey: "id_rol",
  as: "asignaciones_pp",
});

PermisoPrivilegio.hasMany(RolPP, {
  foreignKey: "id_pp",
  as: "asignaciones_roles",
});

// Asociaciones básicas de clientes
Clients.hasMany(AddressClients, { 
  foreignKey: "id_cliente", 
  as: "direcciones" 
});

AddressClients.belongsTo(Clients, { 
  foreignKey: "id_cliente", 
  as: "cliente" 
});

module.exports = {
  Users,
  Roles,
  Permisos,
  Privilegios,
  PermisoPrivilegio,
  RolPP,
  Clients,
  AddressClients,
};
