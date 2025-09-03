const { Sequelize } = require("sequelize");
require("dotenv").config();

async function setupDatabase() {
  console.log("🔧 Configurando base de datos...");

  // Conectar sin especificar base de datos para poder crearla
  const sequelize = new Sequelize(
    "mysql",
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "mysql",
      logging: false,
    }
  );

  try {
    // Verificar conexión
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL establecida correctamente");

    // Crear base de datos si no existe
    await sequelize.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );
    console.log(`✅ Base de datos '${process.env.DB_NAME}' creada/verificada`);

    console.log("🎉 Configuración de base de datos completada");
  } catch (error) {
    console.error("❌ Error configurando la base de datos:", error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

setupDatabase();
