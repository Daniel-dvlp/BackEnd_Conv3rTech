const QuoteDetail = require('../../models/quotes/QuoteDetails');
const Quote = require('../../models/quotes/Quote');
const Product = require('../../models/products/Product');
const Service = require('../../models/services/Service');

// ✅ Crear detalle de cotización
const createQuoteDetail = async (detail) => {
    return QuoteDetail.create(detail);
};

// ✅ Obtener todos los detalles (puede usarse poco, pero es útil para debugging)
const getAllQuoteDetails = async () => {
    return QuoteDetail.findAll({
        include: [
            { model: Quote, as: 'cotizacion' },
            { model: Product, as: 'producto' },
            { model: Service, as: 'servicio' }
        ]
    });
};

// ✅ Obtener detalles por cotización
const getDetailsByQuoteId = async (id_cotizacion) => {
    return QuoteDetail.findAll({
        where: { id_cotizacion },
        include: [
            { model: Product, as: 'producto' },
            { model: Service, as: 'servicio' }
        ]
    });
};

// ✅ Obtener un detalle por ID
const getQuoteDetailById = async (id) => {
    return QuoteDetail.findByPk(id, {
        include: [
            { model: Quote, as: 'cotizacion' },
            { model: Product, as: 'producto' },
            { model: Service, as: 'servicio' }
        ]
    });
};

// ✅ Actualizar detalle de cotización
const updateQuoteDetail = async (id, detail) => {
    return QuoteDetail.update(detail, { where: { id_detalle_cot: id } });
};

// ✅ Eliminar un detalle
const deleteQuoteDetail = async (id) => {
    return QuoteDetail.destroy({ where: { id_detalle_cot: id } });
};

module.exports = {
    createQuoteDetail,
    getAllQuoteDetails,
    getDetailsByQuoteId,
    getQuoteDetailById,
    updateQuoteDetail,
    deleteQuoteDetail
};
