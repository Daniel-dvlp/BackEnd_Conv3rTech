const DataInitializer = require('./init_data');
const sequelize = require('../config/database');

async function runInitialization() {
  try {
    console.log('🔌 Conectando a la base de datos...');
    
    // Probar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // --- 👇 PASO CLAVE AGREGADO AQUÍ 👇 ---
    console.log('🗑️  Limpiando la base de datos...');
    // Esta línea borra todas las tablas y las vuelve a crear.
    await sequelize.sync({ force: true });
    console.log('✅ Base de datos limpiada y sincronizada correctamente.\n');
    // --- 👆 FIN DEL PASO CLAVE 👆 ---

    // Ejecutar inicialización
    const initializer = new DataInitializer();
    await initializer.init();

    console.log('\n🎉 ¡Inicialización completada exitosamente!');
    console.log('🚀 El sistema está listo para usar.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runInitialization();
}

module.exports = runInitialization;