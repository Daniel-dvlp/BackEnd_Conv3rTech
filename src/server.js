const app = require('./app');
const sequelize = require('./config/database');
const PORT = 3006;

sequelize.sync().then(() => {
    console.log('>>> Base de datos conectada');
    app.listen(PORT, () => {
        console.log(`>>> Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Error al conectar la base de datos:', err);
});
