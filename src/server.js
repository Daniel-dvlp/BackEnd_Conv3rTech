// src/server.js
const app = require("./app");
const sequelize = require("./config/database");
const initRBAC = require("./startup/rbacInit");

const PORT = process.env.PORT || 3006;

(async () => {
  try {
    // 1) Conexión
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida correctamente");

    // 2) Sincronizar modelos (cuidado con alter/force en producción)
    await sequelize.sync();
    console.log("✅ Modelos sincronizados");

    // 3) Inicializar RBAC (roles, permisos, privilegios, estados de usuario)
    await initRBAC();

    // 4) Levantar servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error conectando a la base de datos:", err);

    // Levantar igual el servidor sin BD
    console.log(
      "⚠️  Iniciando servidor sin sincronización de base de datos..."
    );
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (sin BD)`);
    });
  }
})();
