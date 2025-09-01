const sequelize = require("../config/database");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

// Importar modelos
const Roles = require("../models/roles/roles");
const Permisos = require("../models/permisos/permisos");
const Privilegios = require("../models/privilegios/privilegios");
const PermisoPrivilegio = require("../models/permiso_privilegio/permiso_privilegio");
const RolPP = require("../models/rol_pp/rol_pp");
const EstadoUsuarios = require("../models/estado_usuarios/estado_usuarios");
const Users = require("../models/users/Users");

// Importar asociaciones
require("../models/associations");

async function initRBAC() {
  try {
    console.log("🚀 Iniciando configuración del sistema RBAC...");

    // Sincronizar modelos con la base de datos
    await sequelize.sync({ force: true });
    console.log("✅ Tablas creadas correctamente");

    // Crear estados de usuario
    const estados = [
      { estado: "Activo" },
      { estado: "Inactivo" },
      { estado: "Suspendido" },
      { estado: "Pendiente de activación" },
    ];

    await EstadoUsuarios.bulkCreate(estados);
    console.log("✅ Estados de usuario creados");

    // Crear roles básicos
    const roles = [
      {
        nombre_rol: "Administrador",
        descripcion: "Rol con acceso completo al sistema",
        estado: true,
      },
      {
        nombre_rol: "Gerente",
        descripcion: "Rol con acceso a gestión y reportes",
        estado: true,
      },
      {
        nombre_rol: "Supervisor",
        descripcion: "Rol con acceso a supervisión de proyectos",
        estado: true,
      },
      {
        nombre_rol: "Empleado",
        descripcion: "Rol básico para empleados",
        estado: true,
      },
      {
        nombre_rol: "Cliente",
        descripcion: "Rol para clientes del sistema",
        estado: true,
      },
    ];

    await Roles.bulkCreate(roles);
    console.log("✅ Roles creados");

    // Crear permisos (módulos del sistema)
    const permisos = [
      { nombre_permiso: "Usuarios" },
      { nombre_permiso: "Roles" },
      { nombre_permiso: "Clientes" },
      { nombre_permiso: "Proyectos" },
      { nombre_permiso: "Productos" },
      { nombre_permiso: "Servicios" },
      { nombre_permiso: "Compras" },
      { nombre_permiso: "Ventas" },
      { nombre_permiso: "Reportes" },
      { nombre_permiso: "Configuracion" },
    ];

    await Permisos.bulkCreate(permisos);
    console.log("✅ Permisos creados");

    // Crear privilegios (acciones genéricas)
    const privilegios = [
      { nombre_privilegio: "Crear" },
      { nombre_privilegio: "Leer" },
      { nombre_privilegio: "Actualizar" },
      { nombre_privilegio: "Eliminar" },
      { nombre_privilegio: "Exportar" },
      { nombre_privilegio: "Importar" },
      { nombre_privilegio: "Aprobar" },
      { nombre_privilegio: "Rechazar" },
    ];

    await Privilegios.bulkCreate(privilegios);
    console.log("✅ Privilegios creados");

    // Crear relaciones permiso-privilegio para el administrador (acceso completo)
    const permisosAdmin = await Permisos.findAll();
    const privilegiosAdmin = await Privilegios.findAll();

    const permisoPrivilegiosAdmin = [];
    for (const permiso of permisosAdmin) {
      for (const privilegio of privilegiosAdmin) {
        permisoPrivilegiosAdmin.push({
          id_permiso: permiso.id_permiso,
          id_privilegio: privilegio.id_privilegio,
        });
      }
    }

    await PermisoPrivilegio.bulkCreate(permisoPrivilegiosAdmin);
    console.log("✅ Relaciones permiso-privilegio creadas");

    // Asignar todos los permisos-privilegios al rol administrador
    const permisoPrivilegios = await PermisoPrivilegio.findAll();
    const rolAdmin = await Roles.findOne({
      where: { nombre_rol: "Administrador" },
    });

    const rolPPAdmin = permisoPrivilegios.map((pp) => ({
      id_rol: rolAdmin.id_rol,
      id_pp: pp.id_pp,
    }));

    await RolPP.bulkCreate(rolPPAdmin);
    console.log("✅ Permisos asignados al administrador");

    // Crear relaciones permiso-privilegio para otros roles
    const permisosGerente = await Permisos.findAll({
      where: {
        nombre_permiso: [
          "Clientes",
          "Proyectos",
          "Productos",
          "Servicios",
          "Compras",
          "Ventas",
          "Reportes",
        ],
      },
    });

    const privilegiosGerente = await Privilegios.findAll({
      where: {
        nombre_privilegio: [
          "Crear",
          "Leer",
          "Actualizar",
          "Exportar",
          "Aprobar",
          "Rechazar",
        ],
      },
    });

    const permisoPrivilegiosGerente = [];
    for (const permiso of permisosGerente) {
      for (const privilegio of privilegiosGerente) {
        permisoPrivilegiosGerente.push({
          id_permiso: permiso.id_permiso,
          id_privilegio: privilegio.id_privilegio,
        });
      }
    }

    await PermisoPrivilegio.bulkCreate(permisoPrivilegiosGerente, {
      ignoreDuplicates: true,
    });

    // Asignar permisos al rol gerente
    const rolGerente = await Roles.findOne({
      where: { nombre_rol: "Gerente" },
    });
    const permisoPrivilegiosGerenteDB = await PermisoPrivilegio.findAll({
      where: {
        id_permiso: permisosGerente.map((p) => p.id_permiso),
        id_privilegio: privilegiosGerente.map((p) => p.id_privilegio),
      },
    });

    const rolPPGerente = permisoPrivilegiosGerenteDB.map((pp) => ({
      id_rol: rolGerente.id_rol,
      id_pp: pp.id_pp,
    }));

    await RolPP.bulkCreate(rolPPGerente);
    console.log("✅ Permisos asignados al gerente");

    // Crear usuario administrador por defecto
    const estadoActivo = await EstadoUsuarios.findOne({
      where: { estado: "Activo" },
    });
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Users.create({
      documento: "12345678",
      tipo_documento: "CC",
      nombre: "Administrador",
      apellido: "Sistema",
      celular: "+573001234567",
      correo: "admin@conv3rtech.com",
      contrasena: hashedPassword,
      id_rol: rolAdmin.id_rol,
      id_estado_usuario: estadoActivo.id_estado_usuario,
    });

    console.log("✅ Usuario administrador creado");
    console.log("📧 Email: admin@conv3rtech.com");
    console.log("🔑 Contraseña: admin123");

    console.log("🎉 Sistema RBAC configurado exitosamente!");
  } catch (error) {
    console.error("❌ Error al configurar el sistema RBAC:", error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initRBAC()
    .then(() => {
      console.log("✅ Inicialización RBAC completada");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error en la inicialización RBAC:", error);
      process.exit(1);
    });
}

module.exports = initRBAC;
