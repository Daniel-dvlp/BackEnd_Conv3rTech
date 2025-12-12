const sequelize = require("../config/database");
const Role = require("../models/auth/Role");
const Users = require("../models/users/Users");
const Permission = require("../models/auth/Permission");
const Privilege = require("../models/auth/Privilege");
const RolPermisoPrivilegio = require("../models/rol_permiso_privilegio/rol_permiso_privilegio");
const bcrypt = require("bcryptjs");

// Definición de roles
const roles = [
  { nombre_rol: "Administrador", descripcion: "Acceso total al sistema" },
  { nombre_rol: "Coordinador", descripcion: "Gestiona proyectos y empleados" },
  { nombre_rol: "Tecnico", descripcion: "Acceso a proyectos asignados" },
];

// Definición de usuarios
const users = [
  // Usuario Admin solicitado
  {
    nombre: "Admin",
    apellido: "General",
    correo: "admin@conv3rtech.com",
    contrasena: "Admin123*",
    documento: "900000000",
    tipo_documento: "NIT",
    celular: "3000000000",
    rol: "Administrador",
  },
  // Usuarios originales de seed_full_setup
  {
    nombre: "Luissy Yahimar",
    apellido: "Angulo Suarez",
    correo: "luissyhaimar@gmail.com",
    contrasena: "Luissy89*",
    documento: "5956345",
    tipo_documento: "PPT",
    celular: "3177908778",
    rol: "Administrador",
  },
  {
    nombre: "Daniel",
    apellido: "Zapata Bedoya",
    correo: "Daniel.zapb@gmail.com",
    contrasena: "Daniel123*",
    documento: "103348904",
    tipo_documento: "CC",
    celular: "3007422869",
    rol: "Coordinador",
  },
  {
    nombre: "Sarai",
    apellido: "Albujen",
    correo: "s.albujen@gmail.com",
    contrasena: "SaraiA187*",
    documento: "5952147",
    tipo_documento: "PPT",
    celular: "3175684239",
    rol: "Tecnico",
  },
  {
    nombre: "Juan",
    apellido: "Perez",
    correo: "juan.perez@gmail.com",
    contrasena: "Juan123*",
    documento: "123456789",
    tipo_documento: "CC",
    celular: "3001234567",
    rol: "Tecnico",
  },
];

const permissionsList = [
  "Dashboard", 
  "Usuarios", 
  "Roles", 
  "Proyectos", 
  "Clientes", 
  "Proveedores", 
  "Servicios", 
  "Categoría de productos", 
  "Productos",
  "Venta de productos", 
  "Compras", 
  "Cotizaciones", 
  "Citas", 
  "Programación laboral", 
  "Pagos y abonos", 
  "Categoría de servicios"
];

const privilegesList = ["Ver", "Crear", "Editar", "Eliminar"];

async function deploy() {
  try {
    console.log("🚀 Iniciando despliegue a base de datos remota...");
    
    await sequelize.authenticate();
    console.log("✅ Conexión establecida correctamente.");
    
    console.log("🔄 Sincronizando esquema de base de datos...");
    await sequelize.sync({ alter: true });
    console.log("✅ Base de datos sincronizada.");

    try {
        console.log("🛠 Corrigiendo índices (eliminando restricción única incorrecta de Sequelize)...");
        // Desactivar chequeo de FK para permitir borrar índices asociados
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

        // 1. Crear índices seguros para las FKs
         try {
              await sequelize.query("CREATE INDEX `idx_rol_permiso_privilegio_id_permiso` ON `rol_permiso_privilegio` (`id_permiso`)");
              console.log("   Índice auxiliar id_permiso creado.");
         } catch (idxErr) { console.log("   Info: " + idxErr.message); }

         try {
              await sequelize.query("CREATE INDEX `idx_rol_permiso_privilegio_id_privilegio` ON `rol_permiso_privilegio` (`id_privilegio`)");
              console.log("   Índice auxiliar id_privilegio creado.");
         } catch (idxErr) { console.log("   Info: " + idxErr.message); }

         // 2. Eliminar TODOS los índices únicos problemáticos generados por Sequelize
         const badIndexes = [
             'rol_permiso_privilegio_id_permiso_id_rol_unique',
             'rol_permiso_privilegio_id_privilegio_id_rol_unique',
             'rol_permiso_privilegio_id_permiso_id_privilegio_unique', // Adivinando el nombre del 3er par
             'rol_permiso_privilegio_id_privilegio_id_permiso_unique'  // Orden alternativo
         ];

         for (const idx of badIndexes) {
             try {
                 await sequelize.query(`ALTER TABLE \`rol_permiso_privilegio\` DROP INDEX \`${idx}\``);
                 console.log(`✅ Índice ${idx} eliminado.`);
             } catch (e) {
                 // Ignorar
             }
         }
    } catch (e) {
        // Ignorar si no existe
        console.log("ℹ️ El índice restrictivo no existía o ya fue eliminado (o error: " + e.message + ")");
    } finally {
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    }

    // 1. Roles
    console.log("🌱 Sembrando roles...");
    const roleMap = {};
    for (const r of roles) {
      const [role] = await Role.findOrCreate({
        where: { nombre_rol: r.nombre_rol },
        defaults: r,
      });
      roleMap[r.nombre_rol] = role.id_rol;
    }

    // 2. Users
    console.log("🌱 Sembrando usuarios...");
    for (const u of users) {
      const hashedPassword = await bcrypt.hash(u.contrasena, 10);
      const userData = {
        nombre: u.nombre,
        apellido: u.apellido,
        correo: u.correo,
        contrasena: hashedPassword,
        documento: u.documento,
        tipo_documento: u.tipo_documento,
        celular: u.celular,
        id_rol: roleMap[u.rol],
        estado_usuario: "Activo",
      };

      const [user, created] = await Users.findOrCreate({
        where: { correo: u.correo },
        defaults: userData,
      });
      
      if (!created) {
          // Actualizar contraseña si ya existe para asegurar acceso
          await user.update({
              contrasena: hashedPassword,
              id_rol: roleMap[u.rol]
          });
          console.log(`   Usuario actualizado: ${u.correo}`);
      } else {
          console.log(`   Usuario creado: ${u.correo}`);
      }
    }

    // 3. Permissions
    console.log("🌱 Sembrando permisos...");
    const permMap = {};
    for (const p of permissionsList) {
        const [perm] = await Permission.findOrCreate({ where: { nombre_permiso: p } });
        permMap[p] = perm.id_permiso;
    }

    // 4. Privileges
    console.log("🌱 Sembrando privilegios...");
    const privMap = {};
    for (const p of privilegesList) {
        const [priv] = await Privilege.findOrCreate({ where: { nombre_privilegio: p } });
        privMap[p] = priv.id_privilegio;
    }

    // 5. Assign Permissions
    console.log("🌱 Asignando permisos a roles...");
    
    // Coordinador: All except Roles, No Delete
    // NOTA: Ajustado según corrección reciente (Coordinador es Rol ID 2 en DB nueva si se crea en orden, 
    // pero usamos roleMap para estar seguros)
    const coordId = roleMap["Coordinador"];
    
    // Limpiar permisos existentes para evitar duplicados/errores
    await RolPermisoPrivilegio.destroy({ where: { id_rol: coordId } });
    
    const coordAssigns = [];
    for (const p of permissionsList) {
        if (p === "Roles") continue;
        for (const priv of ["Ver", "Crear", "Editar"]) {
            coordAssigns.push({
                id_rol: coordId,
                id_permiso: permMap[p],
                id_privilegio: privMap[priv]
            });
        }
    }
    await RolPermisoPrivilegio.bulkCreate(coordAssigns);

    // Tecnico: Proyectos (Ver), Citas (Ver), Programación laboral (Ver)
    const techId = roleMap["Tecnico"];
    await RolPermisoPrivilegio.destroy({ where: { id_rol: techId } });
    const techPerms = ["Proyectos", "Citas", "Programación laboral"];
    const techAssigns = [];
    for (const p of techPerms) {
        if (permMap[p]) {
            techAssigns.push({
                id_rol: techId,
                id_permiso: permMap[p],
                id_privilegio: privMap["Ver"]
            });
        }
    }
    await RolPermisoPrivilegio.bulkCreate(techAssigns);

    console.log("✅ Despliegue completado exitosamente.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en despliegue:", error);
    process.exit(1);
  }
}

deploy();
