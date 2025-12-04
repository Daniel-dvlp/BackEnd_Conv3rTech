const Programacion = require('./ProgramacionModel');
const Novedad = require('./NovedadModel');

// Las asociaciones se manejan ahora en los modelos individuales mediante el método .associate()
// y se inicializan en app.js / server.js para evitar duplicados.

module.exports = {
    Programacion,
    Novedad,
};
