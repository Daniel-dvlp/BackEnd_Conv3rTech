const sequelize = require("../config/database");
const Users = require("../models/users/Users");
const bcrypt = require("bcryptjs");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("[resetAdminPassword] Conexión a BD exitosa");

    const email = "admin@conv3rtech.com";
    const newPlain = "admin123";

    const user = await Users.findOne({ where: { correo: email } });
    if (!user) {
      console.log(`[resetAdminPassword] Usuario admin no existe: ${email}`);
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(newPlain, salt);

    user.contrasena = hash;
    if (user.id_rol !== 1) {
      user.id_rol = 1; // asegurar rol admin
    }
    user.estado_usuario = "Activo"; // asegurar estado activo

    await user.save();
    console.log("[resetAdminPassword] Contraseña del admin actualizada y estado 'Activo'.");
  } catch (err) {
    console.error("[resetAdminPassword] Error:", err.message);
    process.exit(1);
  } finally {
    try { await sequelize.close(); } catch {}
  }
})();