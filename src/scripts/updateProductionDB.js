require("dotenv").config();
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

// Modelos
const Role = require("../models/auth/Role");
const Permission = require("../models/auth/Permission");
const Privilege = require("../models/auth/Privilege");
const PermissionPrivilege = require("../models/auth/PermissionPrivilege");
const RolPermisoPrivilegio = require("../models/rol_permiso_privilegio/rol_permiso_privilegio");
const Users = require("../models/users/Users");

// Seeder existente para RBAC
const seedAuth = require("./seedAuth");

async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL || "admin@conv3rtech.com";
  const plainPassword = process.env.ADMIN_PASSWORD || "admin123";
  const forceReset = String(process.env.ADMIN_FORCE_RESET || "false").toLowerCase() === "true";

  const existing = await Users.findOne({ where: { correo: email } });

  if (!existing) {
    const hashed = await bcrypt.hash(plainPassword, 12);
    await Users.create({
      documento: process.env.ADMIN_DOCUMENTO || "12345678",
      tipo_documento: process.env.ADMIN_TIPO_DOCUMENTO || "CC",
      nombre: process.env.ADMIN_NOMBRE || "Administrador",
      apellido: process.env.ADMIN_APELLIDO || "Sistema",
      celular: process.env.ADMIN_CELULAR || "+573001234567",
      correo: email,
      contrasena: hashed,
      id_rol: 1,
      estado_usuario: "Activo",
    });
    console.log(`✅ Usuario admin creado: ${email}`);
    return;
  }

  let changed = false;

  if (existing.id_rol !== 1) {
    existing.id_rol = 1;
    changed = true;
  }
  if (existing.estado_usuario !== "Activo") {
    existing.estado_usuario = "Activo";
    changed = true;
  }
  if (forceReset) {
    const hashed = await bcrypt.hash(plainPassword, 12);
    existing.contrasena = hashed;
    changed = true;
  }

  if (changed) {
    await existing.save();
    console.log(`✅ Usuario admin actualizado: ${email} (${forceReset ? "password reseteada" : "sin reset"})`);
  } else {
    console.log(`ℹ️ Usuario admin ya está correcto: ${email}`);
  }
}

async function run() {
  try {
    console.log("🔧 Iniciando actualización de BD de producción...");
    await sequelize.authenticate();
    console.log("✅ Conexión a BD ok");

    // Sincronizar modelos y ALTER para añadir columnas nuevas
    await sequelize.sync({ alter: true });

    // Sembrar RBAC
    await seedAuth();

    // Asegurar admin
    await ensureAdminUser();

    // Resumen
    const rolesCount = await Role.count();
    const permissionsCount = await Permission.count();
    const privilegesCount = await Privilege.count();
    const rolePermissionsCount = await RolPermisoPrivilegio.count();

    console.log("\n📊 Resumen actualizado:");
    console.log(`- Roles: ${rolesCount}`);
    console.log(`- Permisos: ${permissionsCount}`);
    console.log(`- Privilegios: ${privilegesCount}`);
    console.log(`- Asignaciones rol-permiso-privilegio: ${rolePermissionsCount}`);

    console.log("\n🎉 Actualización de BD completada");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error en actualización de BD:", err?.message || err);
    process.exit(1);
  } finally {
    try { await sequelize.close(); } catch {}
  }
}

if (require.main === module) {
  run();
}