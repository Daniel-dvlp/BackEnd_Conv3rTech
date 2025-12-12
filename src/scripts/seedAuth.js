const sequelize = require("../config/database");
const Role = require("../models/auth/Role");
const Permission = require("../models/auth/Permission");
const Privilege = require("../models/auth/Privilege");
const PermissionPrivilege = require("../models/auth/PermissionPrivilege");
const RolPermisoPrivilegio = require("../models/rol_permiso_privilegio/rol_permiso_privilegio");
const bcrypt = require("bcryptjs");

// Datos iniciales
const roles = [
  {
    id_rol: 1,
    nombre_rol: "Administrador",
    descripcion: "Acceso completo a todos los módulos del sistema",
    estado: true,
  },
  {
    id_rol: 2,
    nombre_rol: "Técnico",
    descripcion: "Acceso limitado a proyectos asignados y programación laboral",
    estado: true,
  },
  {
    id_rol: 3,
    nombre_rol: "Coordinador",
    descripcion: "Acceso a gestión de proyectos, programación laboral y citas",
    estado: true,
  },
];

const permissions = [
  {
    id_permiso: 1,
    nombre_permiso: "Dashboard",
    descripcion: "Acceso al dashboard principal",
    estado: true,
  },
  {
    id_permiso: 2,
    nombre_permiso: "Usuarios",
    descripcion: "Gestión de usuarios del sistema",
    estado: true,
  },
  {
    id_permiso: 3,
    nombre_permiso: "Compras",
    descripcion: "Gestión de compras",
    estado: true,
  },
  {
    id_permiso: 4,
    nombre_permiso: "Proveedores",
    descripcion: "Gestión de proveedores",
    estado: true,
  },
  {
    id_permiso: 5,
    nombre_permiso: "Categoría de productos",
    descripcion: "Gestión de categorías de productos",
    estado: true,
  },
  {
    id_permiso: 6,
    nombre_permiso: "Productos",
    descripcion: "Gestión de productos",
    estado: true,
  },
  {
    id_permiso: 7,
    nombre_permiso: "Servicios",
    descripcion: "Gestión de servicios",
    estado: true,
  },
  {
    id_permiso: 8,
    nombre_permiso: "Categoría de servicios",
    descripcion: "Gestión de categorías de servicios",
    estado: true,
  },
  {
    id_permiso: 9,
    nombre_permiso: "Programación laboral",
    descripcion: "Gestión de programación laboral",
    estado: true,
  },
  {
    id_permiso: 10,
    nombre_permiso: "Ventas",
    descripcion: "Gestión de ventas",
    estado: true,
  },
  {
    id_permiso: 11,
    nombre_permiso: "Clientes",
    descripcion: "Gestión de clientes",
    estado: true,
  },
  {
    id_permiso: 12,
    nombre_permiso: "Venta de productos",
    descripcion: "Gestión de venta de productos",
    estado: true,
  },
  {
    id_permiso: 13,
    nombre_permiso: "Citas",
    descripcion: "Gestión de citas",
    estado: true,
  },
  {
    id_permiso: 14,
    nombre_permiso: "Cotizaciones",
    descripcion: "Gestión de cotizaciones",
    estado: true,
  },
  {
    id_permiso: 15,
    nombre_permiso: "Proyectos de servicio",
    descripcion: "Gestión de proyectos de servicio",
    estado: true,
  },
  {
    id_permiso: 16,
    nombre_permiso: "Pagos y abonos",
    descripcion: "Gestión de pagos y abonos",
    estado: true,
  },

];

const privileges = [
  {
    id_privilegio: 1,
    nombre_privilegio: "crear",
    descripcion: "Crear nuevos registros",
    estado: true,
  },
  {
    id_privilegio: 2,
    nombre_privilegio: "editar",
    descripcion: "Editar registros existentes",
    estado: true,
  },
  {
    id_privilegio: 3,
    nombre_privilegio: "ver",
    descripcion: "Ver registros",
    estado: true,
  },
  {
    id_privilegio: 4,
    nombre_privilegio: "eliminar",
    descripcion: "Eliminar registros",
    estado: true,
  },
  {
    id_privilegio: 5,
    nombre_privilegio: "crear_entrega",
    descripcion: "Crear entregas (solo para proyectos)",
    estado: true,
  },
];

// Asignación de privilegios a permisos
const permissionPrivileges = [
  // Todos los permisos tienen los 4 privilegios básicos
  ...permissions
    .map((perm) => [
      { id_permiso: perm.id_permiso, id_privilegio: 1 }, // crear
      { id_permiso: perm.id_permiso, id_privilegio: 2 }, // editar
      { id_permiso: perm.id_permiso, id_privilegio: 3 }, // ver
      { id_permiso: perm.id_permiso, id_privilegio: 4 }, // eliminar
    ])
    .flat(),
  // El permiso "Proyectos de servicio" tiene además crear_entrega
  { id_permiso: 15, id_privilegio: 5 }, // crear_entrega para Proyectos de servicio
];

// Asignación de permisos y privilegios a roles
const rolePermissions = [
  // Administrador - todos los permisos y privilegios
  ...permissions
    .map((perm) =>
      privileges.map((priv) => ({
        id_rol: 1,
        id_permiso: perm.id_permiso,
        id_privilegio: priv.id_privilegio,
      }))
    )
    .flat(),

  // Técnico - solo ver en proyectos, programación laboral y citas
  { id_rol: 2, id_permiso: 15, id_privilegio: 3 }, // ver Proyectos de servicio
  { id_rol: 2, id_permiso: 9, id_privilegio: 3 }, // ver Programación laboral
  { id_rol: 2, id_permiso: 13, id_privilegio: 3 }, // ver Citas

  // Coordinador - ver, crear, editar en proyectos, programación laboral y citas
  { id_rol: 3, id_permiso: 15, id_privilegio: 1 }, // crear Proyectos de servicio
  { id_rol: 3, id_permiso: 15, id_privilegio: 2 }, // editar Proyectos de servicio
  { id_rol: 3, id_permiso: 15, id_privilegio: 3 }, // ver Proyectos de servicio
  { id_rol: 3, id_permiso: 9, id_privilegio: 1 }, // crear Programación laboral
  { id_rol: 3, id_permiso: 9, id_privilegio: 2 }, // editar Programación laboral
  { id_rol: 3, id_permiso: 9, id_privilegio: 3 }, // ver Programación laboral
  { id_rol: 3, id_permiso: 13, id_privilegio: 1 }, // crear Citas
  { id_rol: 3, id_permiso: 13, id_privilegio: 2 }, // editar Citas
  { id_rol: 3, id_permiso: 13, id_privilegio: 3 }, // ver Citas
];

async function seedAuth() {
  try {
    console.log("🌱 Iniciando semillas de autenticación...");

    // Sincronizar modelos
    await sequelize.sync({ force: false });

    // Insertar roles
    console.log("📝 Insertando roles...");
    for (const role of roles) {
      await Role.findOrCreate({
        where: { id_rol: role.id_rol },
        defaults: role,
      });
    }

    // Insertar permisos
    console.log("📝 Insertando permisos...");
    for (const permission of permissions) {
      await Permission.findOrCreate({
        where: { id_permiso: permission.id_permiso },
        defaults: permission,
      });
    }

    // Insertar privilegios
    console.log("📝 Insertando privilegios...");
    for (const privilege of privileges) {
      await Privilege.findOrCreate({
        where: { id_privilegio: privilege.id_privilegio },
        defaults: privilege,
      });
    }

    // Insertar relación permiso-privilegio
    console.log("📝 Insertando relaciones permiso-privilegio...");
    for (const pp of permissionPrivileges) {
      await PermissionPrivilege.findOrCreate({
        where: {
          id_permiso: pp.id_permiso,
          id_privilegio: pp.id_privilegio,
        },
        defaults: pp,
      });
    }

    // Insertar relación rol-permiso-privilegio
    console.log("📝 Insertando relaciones rol-permiso-privilegio...");
    for (const rpp of rolePermissions) {
      try {
        await RolPermisoPrivilegio.findOrCreate({
          where: {
            id_rol: rpp.id_rol,
            id_permiso: rpp.id_permiso,
            id_privilegio: rpp.id_privilegio,
          },
          defaults: rpp,
        });
      } catch (err) {
        // Ignorar error de duplicado, continuar con el siguiente
        if (err.name === 'SequelizeUniqueConstraintError') {
          continue;
        }
        console.warn(`⚠️ Error insertando rol-permiso-privilegio (Rol: ${rpp.id_rol}, Permiso: ${rpp.id_permiso}):`, err.message);
      }
    }

    console.log("✅ Semillas de autenticación completadas exitosamente");

    // Mostrar resumen
    const rolesCount = await Role.count();
    const permissionsCount = await Permission.count();
    const privilegesCount = await Privilege.count();
    const rolePermissionsCount = await RolPermisoPrivilegio.count();

    console.log("\n📊 Resumen de datos insertados:");
    console.log(`- Roles: ${rolesCount}`);
    console.log(`- Permisos: ${permissionsCount}`);
    console.log(`- Privilegios: ${privilegesCount}`);
    console.log(
      `- Asignaciones rol-permiso-privilegio: ${rolePermissionsCount}`
    );
  } catch (error) {
    console.error("❌ Error en las semillas de autenticación:", error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedAuth()
    .then(() => {
      console.log("🎉 Proceso completado");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Error:", error);
      process.exit(1);
    });
}

module.exports = seedAuth;
