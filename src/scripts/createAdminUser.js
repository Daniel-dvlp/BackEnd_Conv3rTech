const sequelize = require("../config/database");
const Users = require("../models/users/Users");
const bcrypt = require("bcryptjs");

async function createAdminUser() {
  try {
    console.log("👤 Creando usuario administrador...");

    // Verificar si ya existe un usuario administrador
    const existingAdmin = await Users.findOne({
      where: { correo: "admin@conv3rtech.com" },
    });

    if (existingAdmin) {
      console.log("⚠️  El usuario administrador ya existe");
      return;
    }

    // Encriptar contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash("admin123", saltRounds);

    // Crear usuario administrador
    const adminUser = await Users.create({
      documento: "12345678",
      tipo_documento: "CC",
      nombre: "Administrador",
      apellido: "Sistema",
      celular: "+573001234567",
      correo: "admin@conv3rtech.com",
      contrasena: hashedPassword,
      id_rol: 1, // Administrador
      estado_usuario: "Activo",
    });

    console.log("✅ Usuario administrador creado exitosamente");
    console.log("📧 Email: admin@conv3rtech.com");
    console.log("🔑 Contraseña: admin123");
    console.log(
      "⚠️  IMPORTANTE: Cambia la contraseña después del primer login"
    );
  } catch (error) {
    console.error("❌ Error creando usuario administrador:", error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createAdminUser()
    .then(() => {
      console.log("🎉 Proceso completado");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Error:", error);
      process.exit(1);
    });
}

module.exports = createAdminUser;
