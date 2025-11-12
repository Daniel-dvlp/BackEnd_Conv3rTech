const sequelize = require("../config/database");
const Users = require("../models/users/Users");
const bcrypt = require("bcryptjs");

function isValidPassword(pwd) {
  const lengthOk = pwd.length >= 6 && pwd.length <= 15;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasDigit = /\d/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
  return lengthOk && hasUpper && hasLower && hasDigit && hasSpecial;
}

(async () => {
  const email = "daniel.zapb@gmail.com";
  const plain = "Daniel1234^";

  try {
    await sequelize.authenticate();
    console.log("[createTestUser] Conexión a BD exitosa");

    if (!isValidPassword(plain)) {
      console.error(
        "La contraseña no cumple: 6-15 caracteres, mayúscula, minúscula, número y carácter especial"
      );
      process.exit(1);
    }

    const existing = await Users.findOne({ where: { correo: email } });
    const hashed = await bcrypt.hash(plain, 12);

    if (!existing) {
      await Users.create({
        documento: "DAN123456",
        tipo_documento: "CC",
        nombre: "Daniel",
        apellido: "Zapata",
        celular: "+573001112233",
        correo: email,
        contrasena: hashed,
        id_rol: 2, // Usuario estándar
        estado_usuario: "Activo",
      });
      console.log(`✅ Usuario de prueba creado: ${email}`);
    } else {
      existing.contrasena = hashed;
      existing.estado_usuario = "Activo";
      if (!existing.id_rol || existing.id_rol === 1) {
        existing.id_rol = 2;
      }
      await existing.save();
      console.log(`✅ Usuario de prueba actualizado: ${email}`);
    }
  } catch (err) {
    console.error("[createTestUser] Error:", err.message);
    process.exit(1);
  } finally {
    try {
      await sequelize.close();
    } catch {}
  }
})();