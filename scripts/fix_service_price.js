const sequelize = require('../src/config/database');

(async () => {
  try {
    console.log('Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('Conexión exitosa.');

    console.log('Modificando columna precio en tabla servicios...');
    // Ejecutar consulta raw para alterar la tabla
    await sequelize.query("ALTER TABLE servicios MODIFY COLUMN precio DECIMAL(15, 2) NOT NULL;");
    
    console.log('✅ Columna precio actualizada correctamente a DECIMAL(15, 2).');
  } catch (error) {
    console.error('❌ Error al actualizar la base de datos:', error);
  } finally {
    await sequelize.close();
  }
})();
