const Programacion = require('./ProgramacionModel');
const Novedad = require('./NovedadModel');
const User = require('../users/Users');

// Asociaciones de Programación
Programacion.belongsTo(User, {
    foreignKey: 'usuario_id',
    as: 'usuario',
});

// Asociaciones de Novedad
Novedad.belongsTo(User, {
    foreignKey: 'usuario_id',
    as: 'usuario',
});

module.exports = {
    Programacion,
    Novedad,
};
