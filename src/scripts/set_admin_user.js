require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const { Op } = require("sequelize");
const sequelize = require("../config/database");
const UsersRepo = require("../repositories/users/UsersRepositories");
const Users = require("../models/users/Users");
const Role = require("../models/auth/Role");
// Cargar asociaciones para que las inclusiones funcionen en este script
require("../models/auth/associations");

async function ensureAdminRoleId1() {
  // Intenta obtener el rol id=1; si no existe, crea uno con id=1
  let adminRole = await Role.findByPk(1);
  if (adminRole) return adminRole.id_rol;

  // Buscar por nombre
  const existingByName = await Role.findOne({
    where: { nombre_rol: { [Op.iLike || Op.like]: "%Administrador%" } },
  });
  if (existingByName) {
    return existingByName.id_rol;
  }

  // Crear explícitamente id_rol=1 si está libre
  try {
    adminRole = await Role.create({
      id_rol: 1,
      nombre_rol: "Administrador",
      descripcion: "Rol con privilegios de administración",
      estado: true,
    });
    return adminRole.id_rol;
  } catch (e) {
    // Si no se pudo crear con id=1 (p.e. autoincrement bloquea), crear sin id fijo
    adminRole = await Role.create({
      nombre_rol: "Administrador",
      descripcion: "Rol con privilegios de administración",
      estado: true,
    });
    return adminRole.id_rol;
  }
}

async function upsertAdminUser() {
  const payload = {
    nombre: "Daniel",
    apellido: "Zapata",
    correo: "daniel.zapb@gmail.com",
    tipo_documento: "CC",
    documento: "1033489053",
    celular: "+57300123456",
    estado_usuario: "Activo",
  };

  const adminRoleId = await ensureAdminRoleId1();
  payload.id_rol = adminRoleId;

  // Buscar usuario por correo
  const existing = await Users.findOne({ where: { correo: payload.correo } });
  if (existing) {
    await UsersRepo.updateUser(existing.id_usuario, payload);
    const updated = await UsersRepo.getUserById(existing.id_usuario);
    console.log("Usuario actualizado:", {
      id_usuario: updated.id_usuario,
      nombre: updated.nombre,
      apellido: updated.apellido,
      correo: updated.correo,
      tipo_documento: updated.tipo_documento,
      documento: updated.documento,
      celular: updated.celular,
      id_rol: updated.id_rol,
      estado_usuario: updated.estado_usuario,
    });
    return updated;
  }

  // Si no existe, crearlo con contraseña temporal
  const tempPassword = process.env.ADMIN_TEMP_PASSWORD || "Conv3rTech@12345";
  const created = await UsersRepo.createUser({
    ...payload,
    contrasena: tempPassword,
  });
  const fresh = await UsersRepo.getUserById(created.id_usuario);
  console.log("Usuario creado:", {
    id_usuario: fresh.id_usuario,
    correo: fresh.correo,
    temp_password: tempPassword,
    id_rol: fresh.id_rol,
    estado_usuario: fresh.estado_usuario,
  });
  return fresh;
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log("[Script] Conexión a BD OK");
    const result = await upsertAdminUser();
    console.log("[Script] Terminado", { id_usuario: result.id_usuario });
    process.exit(0);
  } catch (error) {
    console.error("[Script] Error:", error);
    process.exit(1);
  }
})();