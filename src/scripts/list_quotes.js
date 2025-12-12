const sequelize = require('../config/database');
const Quote = require('../models/quotes/Quote');
const Client = require('../models/clients/Clients');

const listQuotes = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos.');

    const quotes = await Quote.findAll({
      where: { estado: 'Pendiente' },
      include: [{ model: Client, as: 'cliente' }],
      limit: 5
    });

    console.log('Cotizaciones pendientes encontradas:', quotes.length);
    quotes.forEach(q => {
      console.log(`ID: ${q.id_cotizacion}, Cliente: ${q.cliente ? q.cliente.nombre : 'N/A'}, Total: ${q.total}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
};

listQuotes();
