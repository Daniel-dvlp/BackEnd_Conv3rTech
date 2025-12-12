// src/server.js
const path = require("path");
require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");
require("./models/auth/associations");
require("./models/projects/associations");

const PORT = Number(process.env.PORT) || 3006;

function start(port, attempts = 0) {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE" && attempts < 10) {
      const next = port + 1;
      console.error(`⚠️ Port ${port} in use, trying ${next}...`);
      start(next, attempts + 1);
    } else {
      console.error("❌ Server error:", err);
      process.exit(1);
    }
  });
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida correctamente");
    const mode = String(process.env.SYNC_MODE || "none").toLowerCase();
    if (mode === "force") {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
      await sequelize.sync({ force: true });
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
      console.log("✅ Base de datos sincronizada con force");
    } else if (mode === "alter") {
      await sequelize.sync({ alter: true });
      console.log("✅ Modelos sincronizados con alter");
    } else if (mode === "safe") {
      await sequelize.sync();
      console.log("✅ Modelos sincronizados (creación)");
    } else {
      console.log("⏭️ Sincronización desactivada");
    }
    start(PORT);
  } catch (err) {
    console.error("❌ Error conectando a la base de datos:", err);
    console.log("⚠️ Iniciando servidor sin sincronización de base de datos...");
    start(PORT);
  }
})();
