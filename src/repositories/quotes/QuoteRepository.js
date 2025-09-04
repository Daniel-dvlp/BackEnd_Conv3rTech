const sequelize = require('../../config/database'); // necesario para transacciones
const Quote = require('../../models/quotes/Quote');
const QuoteDetail = require('../../models/quotes/QuoteDetails');
const Client = require('../../models/clients/Clients');
const Product = require('../../models/products/Product');
const Service = require('../../models/services/Service');

// ✅ Crear cotización
const createQuote = async (quote) => {
    return Quote.create(quote);
};

// ✅ Obtener todas las cotizaciones
const getAllQuotes = async () => {
    return Quote.findAll({
        include: [
            { model: Client, as: 'cliente' },
            {
                model: QuoteDetail,
                as: 'detalles',
                include: [
                    { model: Product, as: 'producto' },
                    { model: Service, as: 'servicio' }
                ]
            }
        ]
    });
};

// ✅ Obtener cotización por ID
const getQuoteById = async (id) => {
    return Quote.findByPk(id, {
        include: [
            { association: 'cliente' },
            {
                association: 'detalles',
                include: [
                    { association: 'producto' },
                    { association: 'servicio' }
                ]
            }
        ]
    });
};

// ✅ Actualizar cotización
const updateQuote = async (id, quote) => {
    return Quote.update(quote, { where: { id_cotizacion: id } });
};

// ✅ Eliminar cotización (y sus detalles en cascada)
const deleteQuote = async (id) => {
    const transaction = await sequelize.transaction();
    try {
        // Borrar primero los detalles
        await QuoteDetail.destroy({ where: { id_cotizacion: id }, transaction });

        // Luego borrar la cotización
        await Quote.destroy({ where: { id_cotizacion: id }, transaction });

        await transaction.commit();
        return { message: 'Cotización eliminada correctamente' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// ✅ Cambiar estado de la cotización
const changeQuoteState = async (id, state) => {
    return Quote.update({ estado: state }, { where: { id_cotizacion: id } });
};

module.exports = {
    createQuote,
    getAllQuotes,
    getQuoteById,
    updateQuote,
    deleteQuote,
    changeQuoteState
};
