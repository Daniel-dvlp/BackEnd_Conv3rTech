const sequelize = require("../config/database");
const Role = require("../models/auth/Role");
const Users = require("../models/users/Users");
const Permission = require("../models/auth/Permission");
const Privilege = require("../models/auth/Privilege");
const RolPermisoPrivilegio = require("../models/rol_permiso_privilegio/rol_permiso_privilegio");
const bcrypt = require("bcryptjs");

const roles = [
  { nombre_rol: "Administrador", descripcion: "Acceso total al sistema" },
  { nombre_rol: "Coordinador", descripcion: "Gestiona proyectos y empleados" },
  { nombre_rol: "Tecnico", descripcion: "Acceso a proyectos asignados" },
];

const users = [
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

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida.");
    
    await sequelize.sync({ alter: true });
    console.log("Base de datos sincronizada.");

    // 1. Roles
    const roleMap = {};
    for (const r of roles) {
      const [role] = await Role.findOrCreate({
        where: { nombre_rol: r.nombre_rol },
        defaults: r,
      });
      roleMap[r.nombre_rol] = role.id_rol;
    }

    // 2. Users
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
      
      if (!created) await user.update(userData);
    }

    // 3. Permissions
    const permMap = {};
    for (const p of permissionsList) {
        const [perm] = await Permission.findOrCreate({ where: { nombre_permiso: p } });
        permMap[p] = perm.id_permiso;
    }

    // 4. Privileges
    const privMap = {};
    for (const p of privilegesList) {
        const [priv] = await Privilege.findOrCreate({ where: { nombre_privilegio: p } });
        privMap[p] = priv.id_privilegio;
    }

    // 5. Assign Permissions
    
    // Coordinador: All except Roles, No Delete
    const coordId = roleMap["Coordinador"];
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

    console.log("Seeding con permisos completado exitosamente.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
}

seed();
