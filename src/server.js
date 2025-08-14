const app = require('./app');
const sequelize = require('./config/database');
const PORT = 3000;

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });