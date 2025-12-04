// src/server.js
const app = require("./app");
const sequelize = require("./config/database");

const PORT = process.env.PORT || 3006;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida correctamente");

    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true });
      console.log("✅ Modelos sincronizados (dev)");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error conectando a la base de datos:", err);
    console.log("⚠️ Iniciando servidor sin sincronización de base de datos...");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (sin BD)`);
    });
  }
})();
