const sequelize = require('../src/config/database');

(async () => {
  try {
    console.log('Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('Conexión exitosa.');

    console.log('Actualizando tabla programaciones...');
    await sequelize.query("ALTER TABLE programaciones MODIFY COLUMN estado ENUM('Activa', 'Inactiva', 'Anulada') DEFAULT 'Activa';");
    await sequelize.query("ALTER TABLE programaciones ADD COLUMN motivo_anulacion TEXT NULL;");
    
    console.log('Actualizando tabla novedades...');
    await sequelize.query("ALTER TABLE novedades MODIFY COLUMN estado ENUM('Activa', 'Inactiva', 'Anulada') DEFAULT 'Activa';");
    await sequelize.query("ALTER TABLE novedades ADD COLUMN motivo_anulacion TEXT NULL;");

    console.log('✅ Base de datos actualizada correctamente.');
  } catch (error) {
    // Ignorar error si la columna ya existe (ER_DUP_FIELDNAME)
    if (error.original && error.original.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠️ La columna ya existía, continuando...');
    } else {
      console.error('❌ Error al actualizar la base de datos:', error);
    }
  } finally {
    await sequelize.close();
  }
})();
