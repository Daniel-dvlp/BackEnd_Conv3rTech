// src/startup/rbacInit.js
const sequelize = require("../config/database");
const {
  Roles,
  Permisos,
  Privilegios,
  PermisoPrivilegio, //Quite el RolPermisoPrivilegio y deje este para que funcionara
  RolPP,
  EstadoUsuarios,
} = require("../models/associations");

// --- Catálogos base ---
const MODULOS = [
  "categoria_productos",
  "categoria_servicios",
  "citas",
  "clientes",
  "compras",
  "cotizaciones",
  "ordenes_servicios",
  "pagosyabonos",
  "productos",
  "programacion_laboral",
  "proveedores",
  "proyectos_servicios",
  "roles",
  "servicios",
  "usuarios",
  "venta_productos",
];

const ACCIONES = ["crear", "leer", "actualizar", "eliminar"];

const ROLES = [
  {
    nombre_rol: "ADMINISTRADOR",
    descripcion: "Acceso total a todos los módulos",
  },
  {
    nombre_rol: "COORDINADOR",
    descripcion: "Crea y consulta la mayoría de módulos",
  },
  {
    nombre_rol: "TECNICO",
    descripcion: "Consulta de trabajo y proyectos asignados",
  },
];

const ESTADOS_USUARIO = [{ estado: "ACTIVO" }, { estado: "INACTIVO" }];

// --- Reglas de asignación ---
// Admin: todo en todos los módulos.
const REGLAS_COORDINADOR = {
  crearYLeer: [
    "categoria_productos",
    "categoria_servicios",
    "citas",
    "clientes",
    "compras",
    "cotizaciones",
    "ordenes_servicios",
    "pagosyabonos",
    "productos",
    "programacion_laboral",
    "proveedores",
    "proyectos_servicios",
    "roles",
    "servicios",
    "usuarios",
    "venta_productos",
  ],
};

const REGLAS_TECNICO = {
  leerSolo: ["programacion_laboral", "proyectos_servicios"],
};

// -------------- Helpers --------------
async function ensureEstadosUsuarios() {
  for (const est of ESTADOS_USUARIO) {
    await EstadoUsuarios.findOrCreate({
      where: { estado: est.estado },
      defaults: est,
    });
  }
}

async function ensureRoles() {
  const map = {};
  for (const r of ROLES) {
    const [role] = await Roles.findOrCreate({
      where: { nombre_rol: r.nombre_rol },
      defaults: r,
    });
    map[r.nombre_rol] = role;
  }
  return map;
}

async function ensurePrivilegios() {
  const map = {};
  for (const accion of ACCIONES) {
    const [priv] = await Privilegios.findOrCreate({
      where: { nombre_privilegio: accion },
      defaults: { nombre_privilegio: accion },
    });
    map[accion] = priv;
  }
  return map;
}

async function ensurePermisos() {
  const map = {};
  for (const modulo of MODULOS) {
    const [perm] = await Permisos.findOrCreate({
      where: { nombre_permiso: modulo },
      defaults: { nombre_permiso: modulo },
    });
    map[modulo] = perm;
  }
  return map;
}

async function link(role, permiso, privilegio) {
  try {
    // 1) Asegurar combinación permiso-privilegio en tabla permiso_privilegio
    const [pp] = await PermisoPrivilegio.findOrCreate({
      where: {
        id_permiso: permiso.id_permiso,
        id_privilegio: privilegio.id_privilegio,
      },
      defaults: {
        id_permiso: permiso.id_permiso,
        id_privilegio: privilegio.id_privilegio,
      },
    });

    // 2) Asegurar relación rol con esa combinación en tabla rol_pp
    await RolPP.findOrCreate({
      where: {
        id_rol: role.id_rol,
        id_pp: pp.id_pp,
      },
      defaults: {
        id_rol: role.id_rol,
        id_pp: pp.id_pp,
      },
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return;
    }
    throw error;
  }
}

// -------------- Asignaciones --------------
async function assignAdministrador(roles, permisos, privilegios) {
  const admin = roles["ADMINISTRADOR"];
  for (const modulo of MODULOS) {
    for (const accion of ACCIONES) {
      await link(admin, permisos[modulo], privilegios[accion]);
    }
  }
}

async function assignCoordinador(roles, permisos, privilegios) {
  const coord = roles["COORDINADOR"];
  for (const modulo of REGLAS_COORDINADOR.crearYLeer) {
    await link(coord, permisos[modulo], privilegios["crear"]);
    await link(coord, permisos[modulo], privilegios["leer"]);
  }
}

async function assignTecnico(roles, permisos, privilegios) {
  const tec = roles["TECNICO"];
  for (const modulo of REGLAS_TECNICO.leerSolo) {
    await link(tec, permisos[modulo], privilegios["leer"]);
  }
}

// -------------- Runner principal --------------
async function initRBAC() {
  console.log("[RBAC] ⏳ Inicializando catálogos y asignaciones...");
  // Recomendado: transacción para consistencia
  const tx = await sequelize.transaction();
  try {
    await ensureEstadosUsuarios();
    const roles = await ensureRoles();
    const privilegios = await ensurePrivilegios();
    const permisos = await ensurePermisos();

    // Asignaciones (idempotentes)
    await assignAdministrador(roles, permisos, privilegios);
    await assignCoordinador(roles, permisos, privilegios);
    await assignTecnico(roles, permisos, privilegios);

    await tx.commit();
    console.log("[RBAC] ✅ Inicialización completada sin errores");
  } catch (err) {
    await tx.rollback();
    console.error("[RBAC] ❌ Error en inicialización:", err);
    throw err;
  }
}

module.exports = initRBAC;
