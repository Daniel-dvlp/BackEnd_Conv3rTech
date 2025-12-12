const Programacion = require('./ProgramacionModel');
const Novedad = require('./NovedadModel');
const User = require('../users/Users');

// Ejecutar las asociaciones
if (Programacion.associate) {
    Programacion.associate({ User });
}

if (Novedad.associate) {
    Novedad.associate({ User, Programacion });
}

module.exports = {
    Programacion,
    Novedad,
};
